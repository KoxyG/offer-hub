import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProfile } from "./entity";
import { CreateUserProfileDTO, UpdateUserProfileDTO } from "./dto";

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly repo: Repository<UserProfile>,
  ) {}

  async createProfile(data: CreateUserProfileDTO): Promise<UserProfile> {
    const profile = this.repo.create(data);
    return this.repo.save(profile);
  }

  async getProfileById(profile_id: string): Promise<UserProfile | null> {
    return this.repo.findOne({ where: { profile_id } });
  }

  async updateProfile(
    profile_id: string,
    data: UpdateUserProfileDTO,
  ): Promise<UserProfile> {
    const profile = await this.getProfileById(profile_id);
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${profile_id} not found`);
    }
    await this.repo.update(profile_id, data);
    return this.getProfileById(profile_id) as Promise<UserProfile>;
  }

  async deleteProfile(profile_id: string): Promise<void> {
    await this.repo.delete(profile_id);
  }
}
