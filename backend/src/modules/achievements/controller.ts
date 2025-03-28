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
import { AchievementsService } from "./service";
import { CreateAchievementDto, UpdateAchievementDto } from "./dto";
import { Achievement } from "./entity";

@Controller("achievements")
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  async create(@Body() dto: CreateAchievementDto): Promise<Achievement> {
    return this.achievementsService.create(dto);
  }

  @Get()
  async findAll(): Promise<Achievement[]> {
    return this.achievementsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Achievement> {
    return this.achievementsService.findById(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateAchievementDto,
  ): Promise<Achievement> {
    return this.achievementsService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id") id: string): Promise<void> {
    return this.achievementsService.delete(id);
  }
}
