import { Module, forwardRef } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Verification } from "./entities/verification.entity"
import { StorageModule } from "../storage/storage.module"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { VerificationsController } from "./verification.controller"
import { VerificationsService } from "./verification.service"
import { NotificationsModule } from "../notifications/module"
import { UsersModule } from "../users/module"

@Module({
  imports: [
    TypeOrmModule.forFeature([Verification]),
    forwardRef(() => StorageModule),
    EventEmitterModule.forRoot(),
    forwardRef(() => NotificationsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [VerificationsController],
  providers: [VerificationsService],
  exports: [VerificationsService],
})
export class VerificationsModule {}
