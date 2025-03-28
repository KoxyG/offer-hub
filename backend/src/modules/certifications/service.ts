import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { CreateCertificationDto, UpdateCertificationDto } from "./dto";
import { Certification } from "./entity";

@Injectable()
export class CertificationsService {
  constructor(
    @InjectRepository(Certification)
    private readonly repo: Repository<Certification>,
  ) {}

  async findAll(): Promise<Certification[]> {
    return this.repo.find();
  }

  async create(dto: CreateCertificationDto): Promise<Certification> {
    const certification = this.repo.create({
      certification_id: uuidv4(),
      ...dto,
      verification_status: "pending",
      created_at: new Date(),
    });
    return this.repo.save(certification);
  }

  async findById(id: string): Promise<Certification> {
    const certification = await this.repo.findOne({
      where: { certification_id: id },
    });
    if (!certification)
      throw new NotFoundException(`Certification with ID ${id} not found.`);
    return certification;
  }

  async update(
    id: string,
    dto: UpdateCertificationDto,
  ): Promise<Certification> {
    const certification = await this.findById(id);
    Object.assign(certification, dto);
    return this.repo.save(certification);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Certification with ID ${id} not found.`);
  }
}
