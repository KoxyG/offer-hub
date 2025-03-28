import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
} from "@nestjs/common";
import { ServiceCategoriesService } from "./service";
import { CreateServiceCategoryDto } from "./dto";
import { ServiceCategory } from "./entity";

@Controller("service-categories")
export class ServiceCategoriesController {
  constructor(
    private readonly serviceCategoriesService: ServiceCategoriesService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    return this.serviceCategoriesService.create(dto);
  }

  @Get()
  async findAll(): Promise<ServiceCategory[]> {
    return this.serviceCategoriesService.findAll();
  }

  @Get(":serviceId")
  async findByService(
    @Param("serviceId") serviceId: string,
  ): Promise<ServiceCategory[]> {
    return this.serviceCategoriesService.findByService(serviceId);
  }

  @Delete(":serviceId/:categoryId")
  @HttpCode(204)
  async remove(
    @Param("serviceId") serviceId: string,
    @Param("categoryId") categoryId: string,
  ): Promise<void> {
    return this.serviceCategoriesService.delete(serviceId, categoryId);
  }
}
