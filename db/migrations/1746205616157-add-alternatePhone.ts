import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAlternatePhone1746205616157 implements MigrationInterface {
  name = 'AddAlternatePhone1746205616157';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "alternatePhone" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "alternatePhone"`);
  }
}
