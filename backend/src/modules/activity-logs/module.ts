import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActivityLogs } from "./entity";
import { ActivityLogsController } from "./controller";
import { ActivityLogsService } from "./service";

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLogs])],
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
