import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seeding/seeding.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // const seedService = app.get(SeedService); // if we want to add new data by seeding need to uncomment this line
  // await seedService.seed();
  await app.listen(3000);
}
bootstrap();
