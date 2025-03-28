import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsController } from "./controller";
import { TransactionsService } from "./service";
import { Transaction } from "./entity";
import { User } from "../users/entity";
import { Project } from "../projects/entity";
import { InvoiceModule } from "../invoices/module";
import { DisputeEntity } from "../disputes/disputes.entity";
import { WebhooksModule } from "../webhooks/module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Project, DisputeEntity]),
    WebhooksModule,forwardRef(() => InvoiceModule)
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
