import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
} from "@nestjs/common";
import { PortfolioItemsService } from "./service";
import { CreatePortfolioItemDto, UpdatePortfolioItemDto } from "./dto";

@Controller("portfolio-items")
export class PortfolioItemsController {
  constructor(private readonly portfolioItemsService: PortfolioItemsService) {}

  @Post()
  async create(@Body() dto: CreatePortfolioItemDto) {
    return this.portfolioItemsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.portfolioItemsService.findAll();
  }

  @Get("/:portfolio_item_id")
  async findOne(@Param("portfolio_item_id") portfolio_item_id: string) {
    return this.portfolioItemsService.findById(portfolio_item_id);
  }

  @Patch("/:portfolio_item_id")
  async update(
    @Param("portfolio_item_id") portfolio_item_id: string,
    @Body() dto: UpdatePortfolioItemDto,
  ) {
    return this.portfolioItemsService.update(portfolio_item_id, dto);
  }

  @Delete("/:portfolio_item_id")
  async delete(@Param("portfolio_item_id") portfolio_item_id: string) {
    return this.portfolioItemsService.delete(portfolio_item_id);
  }
}
