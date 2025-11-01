import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1762019391918 implements MigrationInterface {
  name = 'AutoMigration1762019391918';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "online" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "online"`);
  }
}
