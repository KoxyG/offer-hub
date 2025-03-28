import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PortfolioItemsController } from "./controller";
import { PortfolioItemsService } from "./service";
import { PortfolioItem } from "./entity";
import { User } from "../users/entity";

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioItem, User])],
  controllers: [PortfolioItemsController],
  providers: [PortfolioItemsService],
  exports: [PortfolioItemsService],
})
export class PortfolioItemsModule {}
