import {MigrationInterface, QueryRunner} from "typeorm";

export class InsertIntoCurrencyEntityRelationWithOrderEntity1656338487909 implements MigrationInterface {
    name = 'InsertIntoCurrencyEntityRelationWithOrderEntity1656338487909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currencies" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "currencyId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a38a28c3960e17ab3d1d4e92779" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a38a28c3960e17ab3d1d4e92779"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "currencyId"`);
        await queryRunner.query(`ALTER TABLE "currencies" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
