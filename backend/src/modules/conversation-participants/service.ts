import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConversationParticipant } from "./entity";
import { CreateConversationParticipantDto } from "./dto";

@Injectable()
export class ConversationParticipantsService {
  constructor(
    @InjectRepository(ConversationParticipant)
    private readonly repo: Repository<ConversationParticipant>,
  ) {}

  async create(
    dto: CreateConversationParticipantDto,
  ): Promise<ConversationParticipant> {
    const participant = this.repo.create(dto);
    return this.repo.save(participant);
  }

  async findAll(): Promise<ConversationParticipant[]> {
    return this.repo.find({ relations: ["conversation", "user"] });
  }

  async findByConversation(
    conversationId: string,
  ): Promise<ConversationParticipant[]> {
    return this.repo.find({
      where: { conversation_id: conversationId },
      relations: ["user"],
    });
  }

  async delete(conversationId: string, userId: string): Promise<void> {
    const result = await this.repo.delete({
      conversation_id: conversationId,
      user_id: userId,
    });
    if (result.affected === 0)
      throw new NotFoundException(
        `Participant ${userId} not found in conversation ${conversationId}.`,
      );
  }
}
