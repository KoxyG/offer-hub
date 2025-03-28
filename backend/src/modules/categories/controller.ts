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
import { CategoriesService } from "./service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto";
import { Category } from "./entity";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Category> {
    return this.categoriesService.findById(id);
  }

  @Get("slug/:slug")
  async findBySlug(@Param("slug") slug: string): Promise<Category> {
    return this.categoriesService.findBySlug(slug);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(@Param("id") id: string): Promise<void> {
    return this.categoriesService.delete(id);
  }
}
