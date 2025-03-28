import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateActivityLogsDto {
  @IsString()
  action_type: string;

  @IsString()
  entity_type: string;

  @IsOptional()
  @IsUUID()
  entity_id?: string;

  @IsOptional()
  details?: Record<string, any>;

  @IsOptional()
  @IsString()
  ip_address?: string;

  @IsOptional()
  @IsString()
  user_agent?: string;
}

export class UpdateActivityLogsDto {
  @IsOptional()
  @IsString()
  action_type?: string;

  @IsOptional()
  @IsString()
  entity_type?: string;

  @IsOptional()
  @IsUUID()
  entity_id?: string;

  @IsOptional()
  details?: Record<string, any>;

  @IsOptional()
  @IsString()
  ip_address?: string;

  @IsOptional()
  @IsString()
  user_agent?: string;
}
