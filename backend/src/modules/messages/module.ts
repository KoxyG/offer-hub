import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessagesController } from "./controller";
import { MessagesService } from "./service";
import { Message } from "./entity";
import { Conversation } from "../conversations/entity";
import { User } from "../users/entity";

@Module({
  imports: [TypeOrmModule.forFeature([Message, Conversation, User])],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
