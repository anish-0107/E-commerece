import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedSchema1775134787041 implements MigrationInterface {
    name = 'UpdatedSchema1775134787041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cart_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "userId" integer, "productId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_cart_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "userId" integer, "productId" integer, CONSTRAINT "FK_158f0325ccf7f68a5b395fa2f6a" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_cart_item"("id", "quantity", "userId", "productId") SELECT "id", "quantity", "userId", "productId" FROM "cart_item"`);
        await queryRunner.query(`DROP TABLE "cart_item"`);
        await queryRunner.query(`ALTER TABLE "temporary_cart_item" RENAME TO "cart_item"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" RENAME TO "temporary_cart_item"`);
        await queryRunner.query(`CREATE TABLE "cart_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "userId" integer, "productId" integer)`);
        await queryRunner.query(`INSERT INTO "cart_item"("id", "quantity", "userId", "productId") SELECT "id", "quantity", "userId", "productId" FROM "temporary_cart_item"`);
        await queryRunner.query(`DROP TABLE "temporary_cart_item"`);
        await queryRunner.query(`DROP TABLE "cart_item"`);
    }

}
