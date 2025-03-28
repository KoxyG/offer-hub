import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
} from "@nestjs/common";
import { NotificationsService } from "./service";
import { CreateNotificationDto, UpdateNotificationDto } from "./dto";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.notificationsService.findAll();
  }

  @Get("/:notification_id")
  async findOne(@Param("notification_id") notification_id: string) {
    return this.notificationsService.findById(notification_id);
  }

  @Patch("/:notification_id")
  async update(
    @Param("notification_id") notification_id: string,
    @Body() dto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(notification_id, dto);
  }

  @Delete("/:notification_id")
  async delete(@Param("notification_id") notification_id: string) {
    return this.notificationsService.delete(notification_id);
  }
}
