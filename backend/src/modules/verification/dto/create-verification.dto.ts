import { IsNotEmpty, IsUUID } from "class-validator"

export class CreateVerificationDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string
}

