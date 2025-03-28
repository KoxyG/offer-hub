import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateConversationDto, UpdateConversationDto } from "./dto";
import { Conversation } from "./entity";

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly repo: Repository<Conversation>,
  ) {}

  async findAll(): Promise<Conversation[]> {
    return this.repo.find();
  }

  async create(dto: CreateConversationDto): Promise<Conversation> {
    const conversation = this.repo.create(dto);
    return this.repo.save(conversation);
  }

  async findById(id: string): Promise<Conversation> {
    const conversation = await this.repo.findOne({
      where: { conversationId: id },
    });
    if (!conversation)
      throw new NotFoundException(`Conversation with ID ${id} not found.`);
    return conversation;
  }

  async update(id: string, dto: UpdateConversationDto): Promise<Conversation> {
    const conversation = await this.findById(id);
    Object.assign(conversation, dto);
    conversation.updatedAt = new Date();
    return this.repo.save(conversation);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Conversation with ID ${id} not found.`);
  }
}
