import { MigrationInterface, QueryRunner } from 'typeorm';

const dataToSeed = ['admin', 'user', 'manager'];

export class CreateRoles1653984777731 implements MigrationInterface {
  name = 'CreateRoles1653984777731';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const name of dataToSeed) {
      const roleName = name.toLowerCase();

      await queryRunner.query(
        `INSERT INTO "roles"("id") VALUES ('${roleName}') ON CONFLICT ("id") DO NOTHING`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const name of dataToSeed) {
      const roleName = name.toLowerCase();
      await queryRunner.query(
        `DELETE FROM "roles" r WHERE r.id = '${roleName}'`
      );
    }
  }
}
