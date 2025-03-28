import { IsOptional, IsString } from "class-validator";

export class CreateAchievementDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  criteria?: Record<string, any>;

  @IsOptional()
  @IsString()
  nft_contract_address?: string;
}

export class UpdateAchievementDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  criteria?: Record<string, any>;

  @IsOptional()
  @IsString()
  nft_contract_address?: string;
}
