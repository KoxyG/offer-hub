import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { FreelancerSkill } from "../freelancer-skills/entity";
import { Category } from "../categories/entity";

@Entity({ name: "skills" })
export class Skill {
  @PrimaryGeneratedColumn("uuid")
  skill_id: string;

  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @ManyToOne(() => Category, { onDelete: "CASCADE" })
  category: Category;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @OneToMany(() => FreelancerSkill, (freelancerSkill) => freelancerSkill.skill)
  freelancerSkills: FreelancerSkill[];
}
