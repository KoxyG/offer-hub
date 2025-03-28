import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { ActivityLogs } from "../activity-logs/entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid", { name: "user_id" })
  user_id: string;

  @Column({ name: "wallet_address", length: 100, unique: true })
  wallet_address: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ length: 50, unique: true })
  username: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  created_at: Date;

  @Column({
    name: "last_login",
    type: "timestamp with time zone",
    nullable: true,
  })
  last_login: Date;

  @Column({ name: "is_active", default: true })
  is_active: boolean;

  @Column({ name: "two_factor_enabled", default: false })
  two_factor_enabled: boolean;

  @OneToMany(() => ActivityLogs, (activityLog) => activityLog.user)
  activity_logs: ActivityLogs[];
}
