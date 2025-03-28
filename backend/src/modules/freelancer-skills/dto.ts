import { IsUUID, IsString } from "class-validator";

export class CreateFreelancerSkillDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  skill_id: string;

  @IsString()
  experience_level: "beginner" | "intermediate" | "expert";
}

export class UpdateFreelancerSkillDto {
  @IsString()
  experience_level?: "beginner" | "intermediate" | "expert";
}
