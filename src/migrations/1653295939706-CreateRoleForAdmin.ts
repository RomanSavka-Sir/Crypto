import { MigrationInterface, QueryRunner } from 'typeorm';

export class createRoleForAdmin1653295939706 implements MigrationInterface {
  name = 'createRoleForAdmin1653295939706';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "userRoles" ("userId", "roleId") VALUES (1, 'admin')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "userRoles" u WHERE u."userId" = 1 AND u."roleId" = 'admin'`
    );
  }
}
