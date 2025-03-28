import { IsString, IsOptional, IsEmail, Length } from "class-validator";

export class CreateUserDto {
  @IsString()
  @Length(10, 100)
  wallet_address: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @Length(3, 50)
  username: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  is_active?: boolean;

  @IsOptional()
  two_factor_enabled?: boolean;
}

export class UserResponseDto {
  user_id: string;
  wallet_address: string;
  email?: string;
  username: string;
  created_at: Date;
  last_login?: Date;
  is_active: boolean;
  two_factor_enabled: boolean;
}
