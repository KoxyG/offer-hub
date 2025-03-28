import { IsString, IsOptional, IsUUID } from "class-validator";

export class CreateAuthLogDto {
  @IsUUID()
  user_id: string;

  @IsString()
  event_type: string;

  @IsString()
  status: string;

  @IsString()
  ip_address: string;

  @IsString()
  user_agent: string;

  @IsOptional()
  details?: Record<string, any>;
}

export class UpdateAuthLogDto {
  @IsOptional()
  @IsString()
  event_type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  ip_address?: string;

  @IsOptional()
  @IsString()
  user_agent?: string;

  @IsOptional()
  details?: Record<string, any>;
}
