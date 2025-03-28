import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthLogsController } from "./controller";
import { AuthLogsService } from "./service";
import { AuthLog } from "./entity";

@Module({
  imports: [TypeOrmModule.forFeature([AuthLog])],
  controllers: [AuthLogsController],
  providers: [AuthLogsService],
  exports: [AuthLogsService],
})
export class AuthLogsModule {}
