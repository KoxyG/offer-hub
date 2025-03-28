import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from "typeorm";

@Entity("user_profiles")
export class UserProfile {
  @PrimaryGeneratedColumn("uuid")
  profile_id: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "varchar", length: 20 })
  profile_type: "freelancer" | "client";

  @Column({ type: "varchar", length: 100, nullable: true })
  full_name?: string;

  @Column({ type: "text", nullable: true })
  bio?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  country?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  timezone?: string;

  @Column({ type: "text", array: true, nullable: true })
  languages?: string[];

  @Column({ type: "varchar", length: 255, nullable: true })
  profile_image_url?: string;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}
