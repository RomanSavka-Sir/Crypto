import {MigrationInterface, QueryRunner} from "typeorm";

export class InsertIntoUserEntityCode2faColumn1654254261486 implements MigrationInterface {
    name = 'InsertIntoUserEntityCode2faColumn1654254261486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "code2fa" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "code2fa"`);
    }

}
