import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAchievementsController } from "./controller";
import { UserAchievementsService } from "./service";
import { UserAchievement } from "./entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserAchievement])],
  controllers: [UserAchievementsController],
  providers: [UserAchievementsService],
  exports: [UserAchievementsService],
})
export class UserAchievementsModule {}
