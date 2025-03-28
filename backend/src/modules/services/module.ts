import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './controller';
import { ServicesService } from './service';
import { Service } from './entity';
import { WebhooksModule } from '../webhooks/module';

@Module({
  imports: [TypeOrmModule.forFeature([Service]),
  WebhooksModule],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
