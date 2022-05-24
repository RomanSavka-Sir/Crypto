import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
require('dotenv').config();

export class createAdmin1653295939705 implements MigrationInterface {
  name = 'createAdmin1653295939705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await bcrypt.hash(`${process.env.ADMIN_PASSWORD}`, 10);

    await queryRunner.query(
      `INSERT INTO "users" ("email", "password") VALUES ('${process.env.ADMIN_EMAIL}', '${password}') ON CONFLICT ("email") DO NOTHING`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "users" u WHERE u.email = '${process.env.ADMIN_EMAIL}'`
    );
  }
}
