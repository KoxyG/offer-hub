import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "../users/entity";
import { Project } from "../projects/entity";

@Entity("ratings")
export class Rating {
  @PrimaryGeneratedColumn("uuid")
  rating_id!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "from_user_id" })
  fromUser!: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "to_user_id" })
  toUser!: User;

  @ManyToOne(() => Project, { onDelete: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @Column({ type: "int" })
  score!: number;

  @Column({ type: "text", nullable: true })
  comment!: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  created_at!: Date;
}
