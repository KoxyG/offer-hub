import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePortfolioItemDto, UpdatePortfolioItemDto } from "./dto";
import { PortfolioItem } from "./entity";
import { User } from "../users/entity";

@Injectable()
export class PortfolioItemsService {
  constructor(
    @InjectRepository(PortfolioItem)
    private readonly repo: Repository<PortfolioItem>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<PortfolioItem[]> {
    return this.repo.find({ relations: ["user"] });
  }

  async create(dto: CreatePortfolioItemDto): Promise<PortfolioItem> {
    const user = await this.userRepo.findOne({
      where: { user_id: dto.user_id },
    });
    if (!user)
      throw new NotFoundException(`User with ID ${dto.user_id} not found.`);

    const portfolioItem = this.repo.create({ ...dto, user });
    return this.repo.save(portfolioItem);
  }

  async findById(portfolio_item_id: string): Promise<PortfolioItem> {
    const portfolioItem = await this.repo.findOne({
      where: { portfolio_item_id },
      relations: ["user"],
    });
    if (!portfolioItem)
      throw new NotFoundException(
        `Portfolio item with ID ${portfolio_item_id} not found.`,
      );
    return portfolioItem;
  }

  async update(
    portfolio_item_id: string,
    dto: UpdatePortfolioItemDto,
  ): Promise<PortfolioItem> {
    const portfolioItem = await this.findById(portfolio_item_id);
    Object.assign(portfolioItem, dto);
    return this.repo.save(portfolioItem);
  }

  async delete(portfolio_item_id: string): Promise<void> {
    const result = await this.repo.delete(portfolio_item_id);
    if (result.affected === 0)
      throw new NotFoundException(
        `Portfolio item with ID ${portfolio_item_id} not found.`,
      );
  }
}
