import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
} from "@nestjs/common";
import { MessagesService } from "./service";
import { CreateMessageDto, UpdateMessageDto } from "./dto";

@Controller("messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() dto: CreateMessageDto) {
    return this.messagesService.create(dto);
  }

  @Get("/conversation/:conversation_id")
  async getMessages(@Param("conversation_id") conversation_id: string) {
    return this.messagesService.findByConversation(conversation_id);
  }

  @Get("/:message_id")
  async getMessage(@Param("message_id") message_id: string) {
    return this.messagesService.findById(message_id);
  }

  @Patch("/:message_id")
  async updateMessage(
    @Param("message_id") message_id: string,
    @Body() dto: UpdateMessageDto,
  ) {
    return this.messagesService.update(message_id, dto);
  }

  @Delete("/:message_id")
  async deleteMessage(@Param("message_id") message_id: string) {
    return this.messagesService.delete(message_id);
  }
}
