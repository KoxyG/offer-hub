import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { FreelancerSkillsService } from "./service";
import { CreateFreelancerSkillDto, UpdateFreelancerSkillDto } from "./dto";

@Controller("freelancer-skills")
export class FreelancerSkillsController {
  constructor(private readonly service: FreelancerSkillsService) {}

  @Post()
  async create(@Body() dto: CreateFreelancerSkillDto) {
    return this.service.create(dto);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(":user_id/:skill_id")
  async findOne(
    @Param("user_id") user_id: string,
    @Param("skill_id") skill_id: string,
  ) {
    return this.service.findById(user_id, skill_id);
  }

  @Put(":user_id/:skill_id")
  async update(
    @Param("user_id") user_id: string,
    @Param("skill_id") skill_id: string,
    @Body() dto: UpdateFreelancerSkillDto,
  ) {
    return this.service.update(user_id, skill_id, dto);
  }

  @Delete(":user_id/:skill_id")
  async delete(
    @Param("user_id") user_id: string,
    @Param("skill_id") skill_id: string,
  ) {
    return this.service.delete(user_id, skill_id);
  }
}
