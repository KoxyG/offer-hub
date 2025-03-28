import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity({ name: "achievements" })
export class Achievement {
  @PrimaryGeneratedColumn("uuid")
  achievement_id: string;

  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "json", nullable: true })
  criteria?: Record<string, any>;

  @Column({ type: "varchar", length: 100, nullable: true })
  nft_contract_address?: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
