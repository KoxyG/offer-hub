import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entity";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.repo.create(dto);
    return this.repo.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.repo.find({ relations: ["parent_category"] });
  }

  async findById(id: string): Promise<Category> {
    const category = await this.repo.findOne({
      where: { category_id: id },
      relations: ["parent_category"],
    });
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found.`);
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.repo.findOne({
      where: { slug },
      relations: ["parent_category"],
    });
    if (!category)
      throw new NotFoundException(`Category with slug ${slug} not found.`);
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findById(id);
    Object.assign(category, dto);
    return this.repo.save(category);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Category with ID ${id} not found.`);
  }
}
