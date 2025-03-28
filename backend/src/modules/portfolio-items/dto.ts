import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
} from "class-validator";

export class CreatePortfolioItemDto {
  @IsUUID()
  user_id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  project_url?: string;

  @IsOptional()
  @IsArray()
  image_urls?: string[];

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;
}

export class UpdatePortfolioItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  project_url?: string;

  @IsOptional()
  @IsArray()
  image_urls?: string[];

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;
}
