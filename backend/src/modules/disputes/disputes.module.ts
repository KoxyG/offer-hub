import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DisputesService } from "./disputes.service";
import { DisputesController } from "./dsiputes.controller";
import { DisputeEntity } from "./disputes.entity";
import { Transaction } from "../transactions/entity";
import { User } from "../users/entity";
import { WebhooksModule } from '../webhooks/module';

@Module({
  imports: [TypeOrmModule.forFeature([DisputeEntity, Transaction, User]),
  WebhooksModule],
  providers: [DisputesService],
  controllers: [DisputesController],
  exports: [DisputesService],
})
export class DisputesModule {}
