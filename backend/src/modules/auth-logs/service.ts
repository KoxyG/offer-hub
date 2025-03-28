import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { CreateAuthLogDto, UpdateAuthLogDto } from "./dto";
import { AuthLog } from "./entity";

@Injectable()
export class AuthLogsService {
  constructor(
    @InjectRepository(AuthLog) private readonly repo: Repository<AuthLog>,
  ) {}

  async findAll(): Promise<AuthLog[]> {
    return this.repo.find();
  }

  async create(dto: CreateAuthLogDto): Promise<AuthLog> {
    const newAuthLog = this.repo.create({
      auth_log_id: uuidv4(),
      ...dto,
      created_at: new Date(),
    });
    return this.repo.save(newAuthLog);
  }

  async findById(id: string): Promise<AuthLog> {
    const log = await this.repo.findOne({ where: { auth_log_id: id } });
    if (!log) throw new NotFoundException(`Auth log with ID ${id} not found.`);
    return log;
  }

  async update(id: string, dto: UpdateAuthLogDto): Promise<AuthLog> {
    const log = await this.findById(id);
    Object.assign(log, dto);
    return this.repo.save(log);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Auth log with ID ${id} not found.`);
  }

  async getByUserId(userId: string): Promise<AuthLog[]> {
    return this.repo.find({ where: { user: { user_id: userId } } });
  }

  async getByEventType(eventType: string): Promise<AuthLog[]> {
    return this.repo.find({ where: { event_type: eventType } });
  }
}
