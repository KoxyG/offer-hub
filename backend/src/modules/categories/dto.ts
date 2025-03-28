import { IsOptional, IsString, IsUUID, IsBoolean } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  icon_url?: string;

  @IsOptional()
  @IsUUID()
  parent_category_id?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  icon_url?: string;

  @IsOptional()
  @IsUUID()
  parent_category_id?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
