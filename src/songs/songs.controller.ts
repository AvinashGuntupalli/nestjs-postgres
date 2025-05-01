import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song-dto';
import { Song } from './songs.entity';
import { UpdateSongDto } from './dto/update-song.dto';
import { UpdateResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from '../auth/jwt-artist.guard';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  // @Get()
  // findAll(): Promise<Song[]> {
  //   try {
  //     return this.songsService.findAll();
  //   } catch (e) {
  //     throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR); //Error exceptions
  //   }
  // }
  @Get() // pagination
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return this.songsService.paginate({
      page,
      limit,
    });
  }

  @Post()
  @UseGuards(JwtArtistGuard)
  createNewSong(
    @Body() createSongDto: CreateSongDto,
    @Request() request,
  ): Promise<Song> {
    console.log('request.user:', request.user);
    return this.songsService.create(createSongDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  upDate() {
    return 'update the songs';
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.songsService.remove(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDTO: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songsService.update(id, updateSongDTO);
  }
}
