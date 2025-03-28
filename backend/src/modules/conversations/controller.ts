import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
} from "@nestjs/common";
import { ConversationsService } from "./service";
import { CreateConversationDto, UpdateConversationDto } from "./dto";
import { Conversation } from "./entity";

@Controller("conversations")
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  async getAll(): Promise<Conversation[]> {
    return this.conversationsService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateConversationDto): Promise<Conversation> {
    return this.conversationsService.create(dto);
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<Conversation> {
    return this.conversationsService.findById(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateConversationDto,
  ): Promise<Conversation> {
    return this.conversationsService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id") id: string): Promise<void> {
    return this.conversationsService.delete(id);
  }
}
