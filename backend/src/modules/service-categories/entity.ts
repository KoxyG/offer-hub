import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Service } from "../services/entity";
import { Category } from "../categories/entity";

@Entity({ name: "service_categories" })
export class ServiceCategory {
  @PrimaryColumn("uuid")
  service_id: string;

  @PrimaryColumn("uuid")
  category_id: string;

  @ManyToOne(() => Service, { onDelete: "CASCADE" })
  @JoinColumn({ name: "service_id" })
  service: Service;

  @ManyToOne(() => Category, { onDelete: "CASCADE" })
  @JoinColumn({ name: "category_id" })
  category: Category;
}
