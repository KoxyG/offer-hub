import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { UserAchievementsService } from "./service";
import { CreateUserAchievementDTO } from "./dto";
import { UserAchievement } from "./entity";

@Controller("user-achievements")
export class UserAchievementsController {
  constructor(private readonly service: UserAchievementsService) {}

  @Post()
  async create(
    @Body() dto: CreateUserAchievementDTO,
  ): Promise<UserAchievement> {
    return this.service.create(dto);
  }

  @Get()
  async findAll(): Promise<UserAchievement[]> {
    return this.service.findAll();
  }

  @Get(":userId")
  async findByUser(
    @Param("userId") user_id: string,
  ): Promise<UserAchievement[]> {
    return this.service.findByUser(user_id);
  }

  @Delete(":userId/:achievementId")
  async delete(
    @Param("userId") user_id: string,
    @Param("achievementId") achievement_id: string,
  ): Promise<void> {
    return this.service.delete(user_id, achievement_id);
  }
}
