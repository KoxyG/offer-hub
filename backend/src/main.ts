import * as dotenv from "dotenv";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log("\n=======================================");
  console.log("🚀 OFFER-HUB Server is running!");
  console.log("=======================================");
  console.log(`🌍 URL: http://localhost:${port}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
  console.log("=======================================\n");
}

bootstrap();
