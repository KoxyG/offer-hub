import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
  IsIn,
} from "class-validator";
import { ProjectStatus } from "./entity";

export class CreateProjectDto {
  @IsUUID()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget_min?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget_max?: number;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsIn(["open", "in_progress", "completed", "cancelled"])
  @IsOptional()
  status?: ProjectStatus;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget_min?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget_max?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsIn(["open", "in_progress", "completed", "cancelled"])
  status?: ProjectStatus;
}
