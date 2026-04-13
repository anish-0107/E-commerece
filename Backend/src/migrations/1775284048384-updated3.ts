import { MigrationInterface, QueryRunner } from "typeorm";

export class Updated31775284048384 implements MigrationInterface {
    name = 'Updated31775284048384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "passowrd" varchar NOT NULL, "role" varchar NOT NULL, "isLocked" boolean NOT NULL DEFAULT (0), "resetCode" varchar, "codeExpiresOn" datetime, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "name", "email", "passowrd", "role", "isLocked") SELECT "id", "name", "email", "passowrd", "role", "isLocked" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "passowrd" varchar NOT NULL, "role" varchar NOT NULL, "isLocked" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "name", "email", "passowrd", "role", "isLocked") SELECT "id", "name", "email", "passowrd", "role", "isLocked" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }

}
