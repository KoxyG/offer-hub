import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entity';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { WebhooksService } from "../webhooks/service";
import { WebhookEvent } from '../webhooks/entity';

@Injectable()
export class ServicesService {
  constructor(@InjectRepository(Service) private readonly repo: Repository<Service>,
  private readonly webhooksService: WebhooksService) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    const service = this.repo.create(dto);
    const savedService = await this.repo.save(service);
    //wWbhook trigger
    const webhookData = {
      event: WebhookEvent.SERVICE_BOOKED, 
      data: {
        savedService
      }
    };
  
    await this.webhooksService.triggerWebhook(webhookData);
  
    return savedService;
  }

  async findAll(): Promise<Service[]> {
    return this.repo.find({ relations: ["freelancer"] });
  }

  async findById(id: string): Promise<Service> {
    const service = await this.repo.findOne({
      where: { service_id: id },
      relations: ["freelancer"],
    });
    if (!service)
      throw new NotFoundException(`Service with ID ${id} not found.`);
    return service;
  }

  async findByFreelancer(freelancerId: string): Promise<Service[]> {
    return this.repo.find({
      where: { freelancer_id: freelancerId },
      relations: ["freelancer"],
    });
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findById(id);
    Object.assign(service, dto);
    return this.repo.save(service);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Service with ID ${id} not found.`);
  }
}
