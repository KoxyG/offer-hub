import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ServiceCategory } from "./entity";
import { CreateServiceCategoryDto } from "./dto";

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly repo: Repository<ServiceCategory>,
  ) {}

  async create(dto: CreateServiceCategoryDto): Promise<ServiceCategory> {
    const serviceCategory = this.repo.create(dto);
    return this.repo.save(serviceCategory);
  }

  async findAll(): Promise<ServiceCategory[]> {
    return this.repo.find({ relations: ["service", "category"] });
  }

  async findByService(serviceId: string): Promise<ServiceCategory[]> {
    return this.repo.find({
      where: { service_id: serviceId },
      relations: ["category"],
    });
  }

  async delete(serviceId: string, categoryId: string): Promise<void> {
    const result = await this.repo.delete({
      service_id: serviceId,
      category_id: categoryId,
    });
    if (result.affected === 0)
      throw new NotFoundException(
        `Relation between service ${serviceId} and category ${categoryId} not found.`,
      );
  }
}
