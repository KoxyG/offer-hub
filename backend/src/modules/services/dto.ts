import {
  IsUUID,
  IsString,
  IsNumber,
  IsBoolean,
  Min,
  MaxLength,
  IsOptional,
} from "class-validator";

export class CreateServiceDto {
  @IsUUID()
  freelancer_id: string;

  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  base_price: number;

  @IsNumber()
  @Min(1)
  delivery_time_days: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  base_price?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  delivery_time_days?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
