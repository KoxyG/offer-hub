import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from "class-validator";
import { CreateActivityLogsDto, UpdateActivityLogsDto } from "./dto";
import { ActivityLogs } from "./entity";

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLogs)
    private readonly repo: Repository<ActivityLogs>,
  ) {}

  async create(activityLogData: CreateActivityLogsDto) {
    const errors = await validate(activityLogData);
    if (errors.length > 0) throw new BadRequestException(errors);

    const activityLog = this.repo.create(activityLogData);
    return this.repo.save(activityLog);
  }

  async findById(id: string) {
    const activityLog = await this.repo.findOne({ where: { log_id: id } });
    if (!activityLog)
      throw new NotFoundException(`Activity Log with ID ${id} not found.`);
    return activityLog;
  }

  async findAll() {
    return this.repo.find();
  }

  async update(id: string, data: UpdateActivityLogsDto) {
    const activityLog = await this.findById(id);
    Object.assign(activityLog, data);
    return this.repo.save(activityLog);
  }

  async delete(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Activity Log with ID ${id} not found.`);
  }
}
