import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
} from "@nestjs/common";
import { SkillService } from "./service";
import { CreateSkillDto, UpdateSkillDto } from "./dto";

@Controller("skills")
export class SkillsController {
  constructor(private readonly service: SkillService) {}

  @Post()
  async create(@Body() dto: CreateSkillDto) {
    return this.service.create(dto);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateSkillDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
