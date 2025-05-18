import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747596577125 implements MigrationInterface {
    name = 'Migration1747596577125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "city" character varying NOT NULL, "frequency" "public"."subscriptions_frequency_enum" NOT NULL, "token" character varying NOT NULL, "is_confirmed" boolean NOT NULL DEFAULT false, "created_id" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_226f09dc4a03c03c3fe267c3491" UNIQUE ("token"), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1cec1b3f7ac2d4d66308dfedc8" ON "subscriptions" ("email", "is_confirmed") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1cec1b3f7ac2d4d66308dfedc8"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
    }

}
