import { IsArray, IsEnum, IsString, IsUrl } from 'class-validator';

export enum WebhookEvent {
  PAYMENT_COMPLETED = 'payment.completed',
  DISPUTE_RESOLVED = 'dispute.resolved',
  SERVICE_BOOKED = 'service.booked',
}

export class CreateWebhookDto {
  @IsString()
  userId: string;

  @IsUrl()
  url: string;

  @IsArray()
  @IsEnum(WebhookEvent, { each: true })
  events: WebhookEvent[];
}
