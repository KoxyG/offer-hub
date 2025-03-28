import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
} from "@nestjs/common";
import { ConversationParticipantsService } from "./service";
import { CreateConversationParticipantDto } from "./dto";
import { ConversationParticipant } from "./entity";

@Controller("conversation-participants")
export class ConversationParticipantsController {
  constructor(
    private readonly conversationParticipantsService: ConversationParticipantsService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateConversationParticipantDto,
  ): Promise<ConversationParticipant> {
    return this.conversationParticipantsService.create(dto);
  }

  @Get()
  async findAll(): Promise<ConversationParticipant[]> {
    return this.conversationParticipantsService.findAll();
  }

  @Get(":conversationId")
  async findByConversation(
    @Param("conversationId") conversationId: string,
  ): Promise<ConversationParticipant[]> {
    return this.conversationParticipantsService.findByConversation(
      conversationId,
    );
  }

  @Delete(":conversationId/:userId")
  @HttpCode(204)
  async remove(
    @Param("conversationId") conversationId: string,
    @Param("userId") userId: string,
  ): Promise<void> {
    return this.conversationParticipantsService.delete(conversationId, userId);
  }
}
