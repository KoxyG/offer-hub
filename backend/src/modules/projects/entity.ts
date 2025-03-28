import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../users/entity";

export enum ProjectStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  project_id: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  client: User;

  @Column({ type: "varchar", length: 200 })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  budget_min?: number;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  budget_max?: number;

  @Column({ type: "date", nullable: true })
  deadline?: Date;

  @Column({ type: "varchar", length: 20, default: ProjectStatus.OPEN })
  status: ProjectStatus;

  @CreateDateColumn({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
