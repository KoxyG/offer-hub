import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateSkillDto, UpdateSkillDto } from "./dto";
import { Skill } from "./entity";
import { Category } from "../categories/entity";

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill) private readonly repo: Repository<Skill>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(): Promise<Skill[]> {
    return this.repo.find({ relations: ["category"] });
  }

  async create(dto: CreateSkillDto): Promise<Skill> {
    const category = await this.categoryRepo.findOne({
      where: { category_id: dto.category_id },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${dto.category_id} not found.`,
      );
    }

    const skill = this.repo.create({ ...dto, category });
    return this.repo.save(skill);
  }

  async findById(id: string): Promise<Skill> {
    const skill = await this.repo.findOne({
      where: { skill_id: id },
      relations: ["category"],
    });
    if (!skill) throw new NotFoundException(`Skill with ID ${id} not found.`);
    return skill;
  }

  async update(id: string, dto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.findById(id);
    Object.assign(skill, dto);
    return this.repo.save(skill);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Skill with ID ${id} not found.`);
  }
}
