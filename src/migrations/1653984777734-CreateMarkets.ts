import { MigrationInterface, QueryRunner } from 'typeorm';

const dataToSeed = ['BTC-USD', 'BTC-UAH', 'USDT-USD', 'USDT-UAH'];

export class CreateMarkets1653984777734 implements MigrationInterface {
  name = 'CreateMarkets1653984777734';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const name of dataToSeed) {
      const marketName = name.toLowerCase();

      await queryRunner.query(
        `INSERT INTO "markets"("id", "status") VALUES ('${marketName}', 'available') ON CONFLICT ("id") DO NOTHING`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const name of dataToSeed) {
      const marketName = name.toLowerCase();

      await queryRunner.query(
        `DELETE FROM "markets" m WHERE m.id = '${marketName}'`
      );
    }
  }
}
