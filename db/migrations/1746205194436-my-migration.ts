import { MigrationInterface, QueryRunner } from 'typeorm';

export class MyMigration1746205194436 implements MigrationInterface {
  name = 'MyMigration1746205194436';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "twoFASecret" text, "enable2FA" boolean NOT NULL DEFAULT false, "apiKey" character varying NOT NULL DEFAULT '', "phone" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "artists" ("id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "REL_f7bd9114dc2849a90d39512911" UNIQUE ("userId"), CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "songs" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "artist" text array NOT NULL, "releaseDate" TIMESTAMP NOT NULL, "duration" TIME NOT NULL, "lyrics" text NOT NULL, CONSTRAINT "PK_e504ce8ad2e291d3a1d8f1ea2f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "songs_artists" ("songsId" integer NOT NULL, "artistsId" integer NOT NULL, CONSTRAINT "PK_78eb64551964b78d544c2ac019b" PRIMARY KEY ("songsId", "artistsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_971d95bf6df45f2b07c317b6b3" ON "songs_artists" ("songsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3f43a7e4032521e4edd2e7ecd2" ON "songs_artists" ("artistsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "artists" ADD CONSTRAINT "FK_f7bd9114dc2849a90d39512911b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "songs_artists" ADD CONSTRAINT "FK_971d95bf6df45f2b07c317b6b34" FOREIGN KEY ("songsId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "songs_artists" ADD CONSTRAINT "FK_3f43a7e4032521e4edd2e7ecd29" FOREIGN KEY ("artistsId") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "songs_artists" DROP CONSTRAINT "FK_3f43a7e4032521e4edd2e7ecd29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "songs_artists" DROP CONSTRAINT "FK_971d95bf6df45f2b07c317b6b34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "artists" DROP CONSTRAINT "FK_f7bd9114dc2849a90d39512911b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3f43a7e4032521e4edd2e7ecd2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_971d95bf6df45f2b07c317b6b3"`,
    );
    await queryRunner.query(`DROP TABLE "songs_artists"`);
    await queryRunner.query(`DROP TABLE "songs"`);
    await queryRunner.query(`DROP TABLE "artists"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
