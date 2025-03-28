import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../users/entity";

@Entity({ name: "auth_logs" })
export class AuthLog {
  @PrimaryGeneratedColumn("uuid")
  auth_log_id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  user: User | null;

  @Column({ type: "varchar", length: 50 })
  event_type: string;

  @Column({ type: "varchar", length: 20 })
  status: string;

  @Column({ type: "varchar", length: 45, nullable: true })
  ip_address: string | null;

  @Column({ type: "text", nullable: true })
  user_agent: string | null;

  @Column({ type: "jsonb", nullable: true })
  details: Record<string, any> | null;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
