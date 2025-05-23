import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { ArtistsController } from './artists.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Artist]), ArtistsModule],
  providers: [ArtistsService],
  exports: [ArtistsService],
  controllers: [ArtistsController],
})
export class ArtistsModule {}
