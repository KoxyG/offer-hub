import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../users/entity";

@Entity({ name: "activity_logs" })
export class ActivityLogs {
  @PrimaryGeneratedColumn("uuid")
  log_id: string;

  @ManyToOne(() => User, (user) => user.activity_logs, {
    nullable: true,
    onDelete: "SET NULL",
  })
  user: User | null;

  @Column({ type: "varchar", length: 50 })
  action_type: string;

  @Column({ type: "varchar", length: 50 })
  entity_type: string;

  @Column({ type: "uuid", nullable: true })
  entity_id: string | null;

  @Column({ type: "jsonb", nullable: true })
  details: Record<string, any> | null;

  @Column({ type: "varchar", length: 45, nullable: true })
  ip_address: string | null;

  @Column({ type: "text", nullable: true })
  user_agent: string | null;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
