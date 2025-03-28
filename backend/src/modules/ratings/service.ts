import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRatingDto, UpdateRatingDto } from "./dto";
import { Rating } from "./entity";
import { User } from "../users/entity";
import { Project } from "../projects/entity";

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private readonly repo: Repository<Rating>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async findAll(): Promise<Rating[]> {
    return this.repo.find({ relations: ["fromUser", "toUser", "project"] });
  }

  async create(dto: CreateRatingDto): Promise<Rating> {
    const fromUser = await this.userRepo.findOne({
      where: { user_id: dto.from_user_id },
    });
    if (!fromUser)
      throw new NotFoundException(
        `User with ID ${dto.from_user_id} not found.`,
      );

    const toUser = await this.userRepo.findOne({
      where: { user_id: dto.to_user_id },
    });
    if (!toUser)
      throw new NotFoundException(`User with ID ${dto.to_user_id} not found.`);

    const project = await this.projectRepo.findOne({
      where: { project_id: dto.project_id },
    });
    if (!project)
      throw new NotFoundException(
        `Project with ID ${dto.project_id} not found.`,
      );

    const rating = this.repo.create({ ...dto, fromUser, toUser, project });
    return this.repo.save(rating);
  }

  async findById(rating_id: string): Promise<Rating> {
    const rating = await this.repo.findOne({
      where: { rating_id },
      relations: ["fromUser", "toUser", "project"],
    });
    if (!rating)
      throw new NotFoundException(`Rating with ID ${rating_id} not found.`);
    return rating;
  }

  async update(rating_id: string, dto: UpdateRatingDto): Promise<Rating> {
    const rating = await this.findById(rating_id);
    Object.assign(rating, dto);
    return this.repo.save(rating);
  }

  async delete(rating_id: string): Promise<void> {
    const result = await this.repo.delete(rating_id);
    if (result.affected === 0)
      throw new NotFoundException(`Rating with ID ${rating_id} not found.`);
  }
}
