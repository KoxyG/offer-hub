import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
} from "@nestjs/common";
import { ProjectsService } from "./service";
import { CreateProjectDto, UpdateProjectDto } from "./dto";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @Get("/:project_id")
  async findOne(@Param("project_id") project_id: string) {
    return this.projectsService.findById(project_id);
  }

  @Patch("/:project_id")
  async update(
    @Param("project_id") project_id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(project_id, dto);
  }

  @Delete("/:project_id")
  async delete(@Param("project_id") project_id: string) {
    return this.projectsService.delete(project_id);
  }
}
