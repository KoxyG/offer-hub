import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger, forwardRef, Inject } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Verification } from "./entities/verification.entity"
import { EventEmitter2 } from "@nestjs/event-emitter"
import type { UpdateVerificationDto } from "./dto/update-verification.dto"
import type { Express } from "express"
import { StorageService } from "../storage/storage.service"
import { VerificationStatus } from "./enums/verificationStatus.enum"
import { NotificationsService } from "../notifications/service"
import { NotificationType } from "../notifications/enums/notification.enum"
import { UsersService } from "../users/service"

@Injectable()
export class VerificationsService {
  private readonly logger = new Logger(VerificationsService.name);

  constructor(
    @InjectRepository(Verification)
    private verificationsRepository: Repository<Verification>,
    @Inject(forwardRef(() => StorageService))
    private storageService: StorageService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService
  ) {}

  async submitVerification(userId: string, file: Express.Multer.File): Promise<Verification> {
    if (!file) {
      throw new BadRequestException("No file uploaded")
    }

    // Validate file type
    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"]
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`)
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException(`File size exceeds the limit of 5MB`)
    }

    // Check if user exists
    const user = await this.usersService.findById(userId)
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    // Check if user already has a pending or approved verification
    const existingVerification = await this.verificationsRepository.findOne({
      where: [
        { userId, status: VerificationStatus.PENDING },
        { userId, status: VerificationStatus.APPROVED },
      ],
    })

    if (existingVerification) {
      if (existingVerification.status === VerificationStatus.PENDING) {
        throw new ConflictException("You already have a pending verification request")
      } else {
        throw new ConflictException("You are already verified")
      }
    }

    try {
      // Upload document to S3
      const documentUrl = await this.storageService.uploadFile(file, "verifications")

      // Create verification record
      const verification = this.verificationsRepository.create({
        userId,
        documentUrl,
        status: VerificationStatus.PENDING,
      })

      const savedVerification = await this.verificationsRepository.save(verification)

      // Emit event for notification
      this.eventEmitter.emit("verification.submitted", {
        userId,
        verificationId: verification.id,
      })

      // Create notification
      await this.notificationsService.create({
        user_id: userId,
        type: NotificationType.VERIFICATION_SUBMITTED,
        title: "Verification Submitted",
        content: "Your verification request has been submitted and is pending review.",
      })

      this.logger.log(`Verification submitted for user ${userId}`)
      return savedVerification
    } catch (error) {
      this.logger.error(`Error submitting verification for user ${userId}:`, error)
      throw new BadRequestException("Failed to submit verification. Please try again later.")
    }
  }

  async findAll(page = 1, limit = 10): Promise<{ data: Verification[]; total: number }> {
    const [data, total] = await this.verificationsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
      relations: ["user"],
    })

    return { data, total }
  }

  async findAllByUserId(userId: string): Promise<Verification[]> {
    return this.verificationsRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    })
  }

  async findOne(id: string): Promise<Verification> {
    const verification = await this.verificationsRepository.findOne({
      where: { id },
      relations: ["user"],
    })

    if (!verification) {
      throw new NotFoundException(`Verification with ID ${id} not found`)
    }

    return verification
  }

  async approveVerification(id: string, adminId: string): Promise<Verification> {
    const verification = await this.findOne(id)

    if (verification.status !== VerificationStatus.PENDING) {
      throw new ConflictException("This verification is not in pending status")
    }

    verification.status = VerificationStatus.APPROVED
    await this.verificationsRepository.save(verification)

    // Emit event for notification
    this.eventEmitter.emit("verification.approved", {
      userId: verification.userId,
      verificationId: verification.id,
      adminId,
    })

    // Create notification
    await this.notificationsService.create({
      user_id: verification.userId,
      type: NotificationType.VERIFICATION_APPROVED,
      title: "Verification Approved",
      content: "Your verification request has been approved. You are now a verified freelancer.",
    })

    this.logger.log(`Verification ${id} approved by admin ${adminId}`)
    return verification
  }

  async rejectVerification(id: string, adminId: string, dto: UpdateVerificationDto): Promise<Verification> {
    const verification = await this.findOne(id)

    if (verification.status !== VerificationStatus.PENDING) {
      throw new ConflictException("This verification is not in pending status")
    }

    if (!dto.rejectionReason) {
      throw new BadRequestException("Rejection reason is required")
    }

    verification.status = VerificationStatus.REJECTED
    verification.rejectionReason = dto.rejectionReason
    await this.verificationsRepository.save(verification)

    // Emit event for notification
    this.eventEmitter.emit("verification.rejected", {
      userId: verification.userId,
      verificationId: verification.id,
      adminId,
      reason: dto.rejectionReason,
    })

    // Create notification
    await this.notificationsService.create({
      user_id: verification.userId,
      type: NotificationType.VERIFICATION_REJECTED,
      title: "Verification Rejected",
      content: `Your verification request has been rejected. Reason: ${dto.rejectionReason}`,
    })

    this.logger.log(`Verification ${id} rejected by admin ${adminId}`)
    return verification
  }

  async getUserVerificationStatus(userId: string): Promise<{ isVerified: boolean }> {
    const verification = await this.verificationsRepository.findOne({
      where: { userId, status: VerificationStatus.APPROVED },
    })

    return { isVerified: !!verification }
  }
}

