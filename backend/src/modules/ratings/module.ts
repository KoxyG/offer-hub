import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RatingsController } from "./controller";
import { RatingsService } from "./service";
import { Rating } from "./entity";
import { User } from "../users/entity";
import { Project } from "../projects/entity";

@Module({
  imports: [TypeOrmModule.forFeature([Rating, User, Project])],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}
