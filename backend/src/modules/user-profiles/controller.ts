import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { UserProfileService } from "./service";
import { CreateUserProfileDTO, UpdateUserProfileDTO } from "./dto";
import { UserProfile } from "./entity";

@Controller("user-profiles")
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  async createProfile(
    @Body() data: CreateUserProfileDTO,
  ): Promise<UserProfile> {
    return this.userProfileService.createProfile(data);
  }

  @Get(":id")
  async getProfile(
    @Param("id") profile_id: string,
  ): Promise<UserProfile | null> {
    const profile = await this.userProfileService.getProfileById(profile_id);
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${profile_id} not found`);
    }
    return profile;
  }

  @Patch(":id")
  async updateProfile(
    @Param("id") profile_id: string,
    @Body() data: UpdateUserProfileDTO,
  ): Promise<UserProfile> {
    return this.userProfileService.updateProfile(profile_id, data);
  }

  @Delete(":id")
  async deleteProfile(@Param("id") profile_id: string): Promise<void> {
    return this.userProfileService.deleteProfile(profile_id);
  }
}
