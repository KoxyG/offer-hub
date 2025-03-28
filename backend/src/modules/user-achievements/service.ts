import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserAchievement } from "./entity";
import { CreateUserAchievementDTO } from "./dto";

@Injectable()
export class UserAchievementsService {
  constructor(
    @InjectRepository(UserAchievement)
    private readonly repo: Repository<UserAchievement>,
  ) {}

  async create(dto: CreateUserAchievementDTO): Promise<UserAchievement> {
    const userAchievement = this.repo.create(dto);
    return this.repo.save(userAchievement);
  }

  async findAll(): Promise<UserAchievement[]> {
    return this.repo.find({ relations: ["user", "achievement"] });
  }

  async findByUser(user_id: string): Promise<UserAchievement[]> {
    const userAchievements = await this.repo.find({
      where: { user_id },
      relations: ["achievement"],
    });

    if (userAchievements.length === 0) {
      throw new NotFoundException(`No achievements found for user ${user_id}`);
    }

    return userAchievements;
  }

  async delete(user_id: string, achievement_id: string): Promise<void> {
    const result = await this.repo.delete({ user_id, achievement_id });
    if (result.affected === 0) {
      throw new NotFoundException(`User achievement not found.`);
    }
  }
}
