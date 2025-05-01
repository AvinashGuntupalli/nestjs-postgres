import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Artist } from '../artists/artist.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text', { array: true })
  artist: string[];

  @Column('timestamp')
  releaseDate: Date;

  @Column('time')
  duration: Date;

  @Column('text')
  lyrics: string;

  // @Column('varchar', { array: true })
  // artists: string[];
  @ManyToMany(() => Artist, (artist) => artist.songs, { cascade: true })
  @JoinTable({ name: 'songs_artists' })
  artists: Artist[];
}
