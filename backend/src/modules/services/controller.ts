import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
} from "@nestjs/common";
import { ServicesService } from "./service";
import { CreateServiceDto, UpdateServiceDto } from "./dto";
import { Service } from "./entity";

@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async create(@Body() dto: CreateServiceDto): Promise<Service> {
    return this.servicesService.create(dto);
  }

  @Get()
  async findAll(): Promise<Service[]> {
    return this.servicesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Service> {
    return this.servicesService.findById(id);
  }

  @Get("freelancer/:freelancerId")
  async findByFreelancer(
    @Param("freelancerId") freelancerId: string,
  ): Promise<Service[]> {
    return this.servicesService.findByFreelancer(freelancerId);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(@Param("id") id: string): Promise<void> {
    return this.servicesService.delete(id);
  }
}
