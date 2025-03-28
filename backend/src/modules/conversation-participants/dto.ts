import { IsUUID } from "class-validator";

export class CreateConversationParticipantDto {
  @IsUUID()
  conversation_id: string;

  @IsUUID()
  user_id: string;
}
