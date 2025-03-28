import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../users/entity";

@Entity({ name: "portfolio_items" })
export class PortfolioItem {
  @PrimaryGeneratedColumn("uuid")
  portfolio_item_id: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @Column({ type: "varchar", length: 200 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  project_url: string;

  @Column("text", { array: true, nullable: true })
  image_urls: string[];

  @CreateDateColumn({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @Column({ type: "boolean", default: false })
  is_featured: boolean;
}
