import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConversationParticipantsController } from "./controller";
import { ConversationParticipantsService } from "./service";
import { ConversationParticipant } from "./entity";

@Module({
  imports: [TypeOrmModule.forFeature([ConversationParticipant])],
  controllers: [ConversationParticipantsController],
  providers: [ConversationParticipantsService],
  exports: [ConversationParticipantsService],
})
export class ConversationParticipantsModule {}
