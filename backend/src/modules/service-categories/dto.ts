import { IsUUID } from "class-validator";

export class CreateServiceCategoryDto {
  @IsUUID()
  service_id: string;

  @IsUUID()
  category_id: string;
}
