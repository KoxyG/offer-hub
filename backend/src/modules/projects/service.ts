import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProjectDto, UpdateProjectDto } from "./dto";
import { Project, ProjectStatus } from "./entity";
import { User } from "../users/entity";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly repo: Repository<Project>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.repo.find({ relations: ["client"] });
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const client = await this.userRepo.findOne({
      where: { user_id: dto.client_id },
    });
    if (!client)
      throw new NotFoundException(`User with ID ${dto.client_id} not found.`);

    const project = this.repo.create({ ...dto, client });
    return this.repo.save(project);
  }

  async findById(project_id: string): Promise<Project> {
    const project = await this.repo.findOne({
      where: { project_id },
      relations: ["client"],
    });
    if (!project)
      throw new NotFoundException(`Project with ID ${project_id} not found.`);
    return project;
  }

  async update(project_id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findById(project_id);
    Object.assign(project, dto);
    return this.repo.save(project);
  }

  async delete(project_id: string): Promise<void> {
    const result = await this.repo.delete(project_id);
    if (result.affected === 0)
      throw new NotFoundException(`Project with ID ${project_id} not found.`);
  }

  async countProjectsByStatus(status: ProjectStatus): Promise<number> {
    return await this.repo.count({ where: { status } });
  }

  async getLatestProjects(limit: number): Promise<Project[]> {
    return await this.repo.find({
      order: { created_at: "DESC" },
      take: limit,
    });
  }
}
