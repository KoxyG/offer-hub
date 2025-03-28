import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAchievementDto, UpdateAchievementDto } from "./dto";
import { Achievement } from "./entity";

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly repo: Repository<Achievement>,
  ) {}

  async create(dto: CreateAchievementDto): Promise<Achievement> {
    const achievement = this.repo.create(dto);
    return this.repo.save(achievement);
  }

  async findAll(): Promise<Achievement[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<Achievement> {
    const achievement = await this.repo.findOne({
      where: { achievement_id: id },
    });
    if (!achievement)
      throw new NotFoundException(`Achievement with ID ${id} not found.`);
    return achievement;
  }

  async update(id: string, dto: UpdateAchievementDto): Promise<Achievement> {
    const achievement = await this.findById(id);
    Object.assign(achievement, dto);
    return this.repo.save(achievement);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Achievement with ID ${id} not found.`);
  }
}
