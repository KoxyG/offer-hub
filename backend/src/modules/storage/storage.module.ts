import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { StorageService } from "./storage.service"

@Module({
  imports: [ConfigModule],
  providers: [
    StorageService,
    {
      provide: ConfigService,
      useClass: ConfigService,
    }
  ],
  exports: [StorageService],
})
export class StorageModule {}