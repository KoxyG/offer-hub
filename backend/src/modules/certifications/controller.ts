import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
} from "@nestjs/common";
import { CertificationsService } from "./service";
import { CreateCertificationDto, UpdateCertificationDto } from "./dto";
import { Certification } from "./entity";

@Controller("certifications")
export class CertificationsController {
  constructor(private readonly certificationsService: CertificationsService) {}

  @Get()
  async getAll(): Promise<Certification[]> {
    return this.certificationsService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateCertificationDto): Promise<Certification> {
    return this.certificationsService.create(dto);
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<Certification> {
    return this.certificationsService.findById(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCertificationDto,
  ): Promise<Certification> {
    return this.certificationsService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id") id: string): Promise<void> {
    return this.certificationsService.delete(id);
  }
}
