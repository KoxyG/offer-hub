import { IsOptional, IsString, IsUUID, IsDate } from "class-validator";

export class CreateCertificationDto {
  @IsUUID()
  user_id: string;

  @IsString()
  title: string;

  @IsString()
  issuing_organization: string;

  @IsDate()
  issue_date: Date;

  @IsOptional()
  @IsDate()
  expiry_date?: Date;

  @IsOptional()
  @IsString()
  credential_url?: string;
}

export class UpdateCertificationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  issuing_organization?: string;

  @IsOptional()
  @IsDate()
  issue_date?: Date;

  @IsOptional()
  @IsDate()
  expiry_date?: Date | null;

  @IsOptional()
  @IsString()
  credential_url?: string | null;

  @IsOptional()
  @IsString()
  verification_status?: "pending" | "verified" | "rejected";
}
