import { Entity, Column, ManyToOne, PrimaryColumn } from "typeorm";
import { Skill } from "../skills/entity";
import { User } from "../users/entity";

@Entity({ name: "freelancer_skills" })
export class FreelancerSkill {
  @PrimaryColumn("uuid")
  user_id: string;

  @PrimaryColumn("uuid")
  skill_id: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Skill, { onDelete: "CASCADE" })
  skill: Skill;

  @Column({ type: "varchar", length: 20 })
  experience_level: "beginner" | "intermediate" | "expert";
}
