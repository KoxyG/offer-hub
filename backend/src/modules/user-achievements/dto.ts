import { IsUUID, IsOptional } from "class-validator";

export class CreateUserAchievementDTO {
  @IsUUID()
  user_id: string;

  @IsUUID()
  achievement_id: string;

  @IsOptional()
  @IsUUID()
  nft_token_id?: string;
}

export class UserAchievementResponseDTO {
  user_id: string;
  achievement_id: string;
  nft_token_id?: string;
  achieved_at: Date;

  constructor(data: any) {
    this.user_id = data.user_id;
    this.achievement_id = data.achievement_id;
    this.nft_token_id = data.nft_token_id;
    this.achieved_at = data.achieved_at;
  }
}
