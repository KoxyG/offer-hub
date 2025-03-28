import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FreelancerSkillsController } from "./controller";
import { FreelancerSkillsService } from "./service";
import { FreelancerSkill } from "./entity";

@Module({
  imports: [TypeOrmModule.forFeature([FreelancerSkill])],
  controllers: [FreelancerSkillsController],
  providers: [FreelancerSkillsService],
  exports: [FreelancerSkillsService],
})
export class FreelancerSkillsModule {}
