import { IsString, IsOptional, IsUUID, IsArray, IsIn } from "class-validator";

export class CreateUserProfileDTO {
  @IsUUID()
  user_id: string;

  @IsString()
  @IsIn(["freelancer", "client"])
  profile_type: "freelancer" | "client";

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsString()
  profile_image_url?: string;
}

export class UpdateUserProfileDTO {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsString()
  profile_image_url?: string;
}
