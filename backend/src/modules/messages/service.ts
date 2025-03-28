import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMessageDto, UpdateMessageDto } from "./dto";
import { Message } from "./entity";
import { Conversation } from "../conversations/entity";
import { User } from "../users/entity";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private readonly repo: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findByConversation(conversation_id: string): Promise<Message[]> {
    return this.repo.find({
      where: { conversation: { conversationId: conversation_id } },
      relations: ["conversation", "sender"],
      order: { created_at: "ASC" },
    });
  }

  async create(dto: CreateMessageDto): Promise<Message> {
    const conversation = await this.conversationRepo.findOne({
      where: { conversationId: dto.conversation_id },
    });
    if (!conversation)
      throw new NotFoundException(
        `Conversation with ID ${dto.conversation_id} not found.`,
      );

    const sender = await this.userRepo.findOne({
      where: { user_id: dto.sender_id },
    });
    if (!sender)
      throw new NotFoundException(`User with ID ${dto.sender_id} not found.`);

    const message = this.repo.create({ ...dto, conversation, sender });
    return this.repo.save(message);
  }

  async findById(message_id: string): Promise<Message> {
    const message = await this.repo.findOne({
      where: { message_id },
      relations: ["conversation", "sender"],
    });
    if (!message)
      throw new NotFoundException(`Message with ID ${message_id} not found.`);
    return message;
  }

  async update(message_id: string, dto: UpdateMessageDto): Promise<Message> {
    const message = await this.findById(message_id);
    Object.assign(message, dto);
    return this.repo.save(message);
  }

  async delete(message_id: string): Promise<void> {
    const result = await this.repo.delete(message_id);
    if (result.affected === 0)
      throw new NotFoundException(`Message with ID ${message_id} not found.`);
  }
}
