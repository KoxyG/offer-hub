import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateFreelancerSkillDto, UpdateFreelancerSkillDto } from "./dto";
import { FreelancerSkill } from "./entity";

@Injectable()
export class FreelancerSkillsService {
  constructor(
    @InjectRepository(FreelancerSkill)
    private readonly repo: Repository<FreelancerSkill>,
  ) {}

  async findAll(): Promise<FreelancerSkill[]> {
    return this.repo.find({ relations: ["user", "skill"] });
  }

  async create(dto: CreateFreelancerSkillDto): Promise<FreelancerSkill> {
    const skill = this.repo.create(dto);
    return this.repo.save(skill);
  }

  async findById(user_id: string, skill_id: string): Promise<FreelancerSkill> {
    const skill = await this.repo.findOne({
      where: { user_id, skill_id },
      relations: ["user", "skill"],
    });
    if (!skill) throw new NotFoundException(`Freelancer skill not found.`);
    return skill;
  }

  async update(
    user_id: string,
    skill_id: string,
    dto: UpdateFreelancerSkillDto,
  ): Promise<FreelancerSkill> {
    const skill = await this.findById(user_id, skill_id);
    Object.assign(skill, dto);
    return this.repo.save(skill);
  }

  async delete(user_id: string, skill_id: string): Promise<void> {
    const result = await this.repo.delete({ user_id, skill_id });
    if (result.affected === 0)
      throw new NotFoundException(`Freelancer skill not found.`);
  }
}
