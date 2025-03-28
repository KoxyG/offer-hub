import { IsEnum, IsOptional, IsString } from "class-validator"
import { VerificationStatus } from "../enums/verificationStatus.enum"

export class UpdateVerificationDto {
  @IsEnum(VerificationStatus)
  @IsOptional()
  status?: VerificationStatus

  @IsString()
  @IsOptional()
  rejectionReason?: string
}

