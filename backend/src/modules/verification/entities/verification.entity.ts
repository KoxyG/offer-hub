import { User } from "@/modules/users/entity"
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { VerificationStatus } from "../enums/verificationStatus.enum"

@Entity("verifications")
export class Verification {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "user_id", type: "uuid" })
  userId: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User

  @Column({ name: "document_url" })
  documentUrl: string

  @Column({
    type: "enum",
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus

  @Column({ name: "rejection_reason", nullable: true })
  rejectionReason: string

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}

