import { Controller, Post, Body, Get, BadRequestException } from '@nestjs/common';
import { WebhooksService } from './service';
import { Webhook} from './entity';
import { CreateWebhookDto } from './dto';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get()
  async getAllWebhooks(): Promise<Webhook[]> {
    return this.webhooksService.findAll();
  }

  @Post()
  async registerWebhook(@Body() createWebhookDto: CreateWebhookDto): Promise<Webhook> {
    return this.webhooksService.register(createWebhookDto);
  }
}
