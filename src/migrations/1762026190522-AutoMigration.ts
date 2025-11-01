import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1762026190522 implements MigrationInterface {
  name = 'AutoMigration1762026190522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "insight" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "summary" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "conversationId" uuid, CONSTRAINT "REL_990013ccf3c3f1106e19e6507e" UNIQUE ("conversationId"), CONSTRAINT "PK_5463e33a58a28dc54d8fb7fea65" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "insight" ADD CONSTRAINT "FK_990013ccf3c3f1106e19e6507eb" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "insight" DROP CONSTRAINT "FK_990013ccf3c3f1106e19e6507eb"`
    );
    await queryRunner.query(`DROP TABLE "insight"`);
  }
}
