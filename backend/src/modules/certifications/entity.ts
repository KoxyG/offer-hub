import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../users/entity";

@Entity({ name: "certifications" })
export class Certification {
  @PrimaryGeneratedColumn("uuid")
  certification_id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "varchar", length: 255 })
  issuing_organization: string;

  @Column({ type: "date" })
  issue_date: Date;

  @Column({ type: "date", nullable: true })
  expiry_date?: Date | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  credential_url?: string | null;

  @Column({
    type: "enum",
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  })
  verification_status: "pending" | "verified" | "rejected";

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
