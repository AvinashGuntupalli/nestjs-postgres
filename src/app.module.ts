import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middle-ware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Song } from './songs/songs.entity';
import { Artist } from './artists/artist.entity';
import { User } from './users/users.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { dataSourceOptions } from '../db/data-source';
import { SeedModule } from './seeding/seeding.module';
@Module({
  // imports: [SongsModule],
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    SongsModule,
    AuthModule,
    UsersModule,
    ArtistsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private datasource: DataSource) {
    /// this constructor function is for checking that we connect to postgresdb
    console.log('dbName', datasource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); /// option 1
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: 'songs', method: RequestMethod.POST }); // option 2 specific to method
    consumer.apply(LoggerMiddleware).forRoutes(SongsController); // option 3 specific to conroller
  }
}
