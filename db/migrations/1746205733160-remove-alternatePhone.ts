import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveAlternatePhone1746205733160 implements MigrationInterface {
  name = 'RemoveAlternatePhone1746205733160';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "alternatePhone"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "alternatePhone" character varying NOT NULL`,
    );
  }
}
