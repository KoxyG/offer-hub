import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
} from "@nestjs/common";
import { RatingsService } from "./service";
import { CreateRatingDto, UpdateRatingDto } from "./dto";

@Controller("ratings")
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  async create(@Body() dto: CreateRatingDto) {
    return this.ratingsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.ratingsService.findAll();
  }

  @Get("/:rating_id")
  async findOne(@Param("rating_id") rating_id: string) {
    return this.ratingsService.findById(rating_id);
  }

  @Patch("/:rating_id")
  async update(
    @Param("rating_id") rating_id: string,
    @Body() dto: UpdateRatingDto,
  ) {
    return this.ratingsService.update(rating_id, dto);
  }

  @Delete("/:rating_id")
  async delete(@Param("rating_id") rating_id: string) {
    return this.ratingsService.delete(rating_id);
  }
}
