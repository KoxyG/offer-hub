import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Conversation } from "../conversations/entity";
import { User } from "../users/entity";

@Entity({ name: "conversation_participants" })
export class ConversationParticipant {
  @PrimaryColumn("uuid")
  conversation_id: string;

  @PrimaryColumn("uuid")
  user_id: string;

  @ManyToOne(() => Conversation, { onDelete: "CASCADE" })
  @JoinColumn({ name: "conversation_id" })
  conversation: Conversation;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
}
