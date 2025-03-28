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
import { AuthLogsService } from "./service";
import { CreateAuthLogDto, UpdateAuthLogDto } from "./dto";
import { AuthLog } from "./entity";

@Controller("auth-logs")
export class AuthLogsController {
  constructor(private readonly authLogsService: AuthLogsService) {}

  @Get()
  async getAll(): Promise<AuthLog[]> {
    return this.authLogsService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateAuthLogDto): Promise<AuthLog> {
    return this.authLogsService.create(dto);
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<AuthLog> {
    return this.authLogsService.findById(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateAuthLogDto,
  ): Promise<AuthLog> {
    return this.authLogsService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id") id: string): Promise<void> {
    return this.authLogsService.delete(id);
  }

  // Rutas adicionales específicas para auth logs
  @Get("user/:userId")
  async getByUserId(@Param("userId") userId: string): Promise<AuthLog[]> {
    return this.authLogsService.getByUserId(userId);
  }

  @Get("event-type/:type")
  async getByEventType(@Param("type") type: string): Promise<AuthLog[]> {
    return this.authLogsService.getByEventType(type);
  }
}
