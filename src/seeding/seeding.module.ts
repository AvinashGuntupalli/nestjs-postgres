import { Module } from '@nestjs/common';
import { SeedService } from './seeding.service';

@Module({
  providers: [SeedService],
})
export class SeedModule {}
