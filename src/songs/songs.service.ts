import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { Song } from './songs.entity';
import { CreateSongDto } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDto } from './dto/update-song.dto';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Artist } from '../artists/artist.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}
  async create(songDTO: CreateSongDto): Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.artist = songDTO.artists;
    song.duration = new Date(songDTO.duration); // Convert ISO string to Date
    song.releaseDate = new Date(songDTO.releaseDate);
    song.lyrics = songDTO.lyrics;
    // find all the artists based on the id's
    const artists = await this.artistRepository.findByIds(songDTO.artists);
    // set the relation with artist and songs
    song.artists = artists;

    return await this.songsRepository.save(song);
  }
  findAll(): Promise<Song[]> {
    return this.songsRepository.find();
  }

  findOne(id: number): Promise<Song> {
    return this.songsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.songsRepository.delete(id);
  }

  update(id: number, recordToUpdate: UpdateSongDto): Promise<UpdateResult> {
    return this.songsRepository.update(id, recordToUpdate);
  }

  // async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
  //   /// PAGINATION
  //   // Adding query builder
  //   return paginate<Song>(this.songsRepository, options);
  // }
  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    // Adding query builder
    const queryBuilder = this.songsRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.releaseDate', 'ASC');
    return paginate<Song>(queryBuilder, options);
  }
}
