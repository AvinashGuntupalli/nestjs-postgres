import { DataSource, DataSourceOptions } from 'typeorm';
import { Song } from '../src/songs/songs.entity';
import { Artist } from '../src/artists/artist.entity';
import { User } from '../src/users/users.entity';
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'simform',
  database: 'spotify-clone',
  entities: [Song, Artist, User],
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions); //4
export default dataSource;
