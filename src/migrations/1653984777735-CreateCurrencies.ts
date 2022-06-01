import { MigrationInterface, QueryRunner } from 'typeorm';

const dataToSeed = [
  {
    name: 'USD',
    prefix: 'US'
  },
  {
    name: 'UAH',
    prefix: 'UA'
  }
];

export class CreateCurrencies1653984777735 implements MigrationInterface {
  name = 'CreateCurrencies1653984777735';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const key of dataToSeed) {
      const currency = key.name.toUpperCase();
      const prefix = key.prefix.toUpperCase();

      await queryRunner.query(
        `INSERT INTO "currencies"("id", "prefix") 
                        VALUES ('${currency}', '${prefix}') ON CONFLICT ("id") DO NOTHING`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const key of dataToSeed) {
      const currency = key.name.toUpperCase();
      await queryRunner.query(
        `DELETE FROM "currencies" c WHERE c.id = '${currency}'`
      );
    }
  }
}
