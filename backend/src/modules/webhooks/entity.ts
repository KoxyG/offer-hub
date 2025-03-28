import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum WebhookEvent {
  PAYMENT_COMPLETED = 'payment.completed',
  DISPUTE_RESOLVED = 'dispute.resolved',
  SERVICE_BOOKED = 'service.booked',
}

@Entity('webhooks')
export class Webhook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'jsonb', nullable: true })
  events: WebhookEvent[];
}