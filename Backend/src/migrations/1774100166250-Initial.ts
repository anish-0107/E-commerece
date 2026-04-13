import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1774100166250 implements MigrationInterface {
    name = 'Initial1774100166250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_type" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, CONSTRAINT "UQ_8978484a9cee7a0c780cd259b88" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "typeId" integer)`);
        await queryRunner.query(`CREATE TABLE "sub_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "categoryId" integer, CONSTRAINT "UQ_7745a7cea2687ee7b048f828c76" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text NOT NULL, "price" decimal(10,2) NOT NULL, "Stockquantity" integer NOT NULL, "imagePath" varchar, "categoryId" integer)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "passowrd" varchar NOT NULL, "role" varchar NOT NULL, "isLocked" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "order" ("Orderid" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "totalAmount" decimal(10,2) NOT NULL, "orderDate" datetime NOT NULL DEFAULT (datetime('now')), "paymentMethod" varchar NOT NULL, "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "amountAtPurchase" decimal(10,2) NOT NULL, "orderOrderid" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "typeId" integer, CONSTRAINT "FK_7aff6c4a31d9a2ec09e31d98f6f" FOREIGN KEY ("typeId") REFERENCES "product_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_category"("id", "name", "typeId") SELECT "id", "name", "typeId" FROM "category"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`ALTER TABLE "temporary_category" RENAME TO "category"`);
        await queryRunner.query(`CREATE TABLE "temporary_sub_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "categoryId" integer, CONSTRAINT "UQ_7745a7cea2687ee7b048f828c76" UNIQUE ("name"), CONSTRAINT "FK_51b8c0b349725210c4bd8b9b7a7" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sub_category"("id", "name", "categoryId") SELECT "id", "name", "categoryId" FROM "sub_category"`);
        await queryRunner.query(`DROP TABLE "sub_category"`);
        await queryRunner.query(`ALTER TABLE "temporary_sub_category" RENAME TO "sub_category"`);
        await queryRunner.query(`CREATE TABLE "temporary_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text NOT NULL, "price" decimal(10,2) NOT NULL, "Stockquantity" integer NOT NULL, "imagePath" varchar, "categoryId" integer, CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "sub_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_product"("id", "name", "description", "price", "Stockquantity", "imagePath", "categoryId") SELECT "id", "name", "description", "price", "Stockquantity", "imagePath", "categoryId" FROM "product"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`ALTER TABLE "temporary_product" RENAME TO "product"`);
        await queryRunner.query(`CREATE TABLE "temporary_order" ("Orderid" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "totalAmount" decimal(10,2) NOT NULL, "orderDate" datetime NOT NULL DEFAULT (datetime('now')), "paymentMethod" varchar NOT NULL, "userId" integer, CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_order"("Orderid", "totalAmount", "orderDate", "paymentMethod", "userId") SELECT "Orderid", "totalAmount", "orderDate", "paymentMethod", "userId" FROM "order"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`ALTER TABLE "temporary_order" RENAME TO "order"`);
        await queryRunner.query(`CREATE TABLE "temporary_order_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "amountAtPurchase" decimal(10,2) NOT NULL, "orderOrderid" integer, CONSTRAINT "FK_7c36290302376e785b4005d819f" FOREIGN KEY ("orderOrderid") REFERENCES "order" ("Orderid") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_order_item"("id", "quantity", "amountAtPurchase", "orderOrderid") SELECT "id", "quantity", "amountAtPurchase", "orderOrderid" FROM "order_item"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`ALTER TABLE "temporary_order_item" RENAME TO "order_item"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" RENAME TO "temporary_order_item"`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "amountAtPurchase" decimal(10,2) NOT NULL, "orderOrderid" integer)`);
        await queryRunner.query(`INSERT INTO "order_item"("id", "quantity", "amountAtPurchase", "orderOrderid") SELECT "id", "quantity", "amountAtPurchase", "orderOrderid" FROM "temporary_order_item"`);
        await queryRunner.query(`DROP TABLE "temporary_order_item"`);
        await queryRunner.query(`ALTER TABLE "order" RENAME TO "temporary_order"`);
        await queryRunner.query(`CREATE TABLE "order" ("Orderid" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "totalAmount" decimal(10,2) NOT NULL, "orderDate" datetime NOT NULL DEFAULT (datetime('now')), "paymentMethod" varchar NOT NULL, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "order"("Orderid", "totalAmount", "orderDate", "paymentMethod", "userId") SELECT "Orderid", "totalAmount", "orderDate", "paymentMethod", "userId" FROM "temporary_order"`);
        await queryRunner.query(`DROP TABLE "temporary_order"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME TO "temporary_product"`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text NOT NULL, "price" decimal(10,2) NOT NULL, "Stockquantity" integer NOT NULL, "imagePath" varchar, "categoryId" integer)`);
        await queryRunner.query(`INSERT INTO "product"("id", "name", "description", "price", "Stockquantity", "imagePath", "categoryId") SELECT "id", "name", "description", "price", "Stockquantity", "imagePath", "categoryId" FROM "temporary_product"`);
        await queryRunner.query(`DROP TABLE "temporary_product"`);
        await queryRunner.query(`ALTER TABLE "sub_category" RENAME TO "temporary_sub_category"`);
        await queryRunner.query(`CREATE TABLE "sub_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "categoryId" integer, CONSTRAINT "UQ_7745a7cea2687ee7b048f828c76" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "sub_category"("id", "name", "categoryId") SELECT "id", "name", "categoryId" FROM "temporary_sub_category"`);
        await queryRunner.query(`DROP TABLE "temporary_sub_category"`);
        await queryRunner.query(`ALTER TABLE "category" RENAME TO "temporary_category"`);
        await queryRunner.query(`CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "typeId" integer)`);
        await queryRunner.query(`INSERT INTO "category"("id", "name", "typeId") SELECT "id", "name", "typeId" FROM "temporary_category"`);
        await queryRunner.query(`DROP TABLE "temporary_category"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "sub_category"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "product_type"`);
    }

}
