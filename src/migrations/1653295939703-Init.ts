import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1653295939703 implements MigrationInterface {
    name = 'Init1653295939703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currencies" ("id" character varying NOT NULL, "prefix" character varying(2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "balances" ("id" SERIAL NOT NULL, "amountInCents" bigint NOT NULL DEFAULT '0', "userId" integer NOT NULL, "currencyId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_74904758e813e401abc3d4261c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trades" ("id" SERIAL NOT NULL, "price" bigint NOT NULL, "volume" integer NOT NULL, "makerUserId" integer NOT NULL, "takerUserId" integer NOT NULL, "marketId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c6d7c36a837411ba5194dc58595" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "markets" ("id" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dda44129b32f21ae9f1c28dcf99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "price" bigint NOT NULL, "volume" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'open', "userId" integer NOT NULL, "marketId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "userRoles" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "roleId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d4603b063a9c768dcfead96e58c" PRIMARY KEY ("id", "userId", "roleId"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying, "status" character varying NOT NULL DEFAULT 'tier0', "firstName" character varying, "lastName" character varying, "countryOfResidence" character varying, "countryOfBirth" character varying, "phone" character varying, "photo" character varying, "dateOfBirth" character varying, "2fa" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "generateEmailCode" ("id" SERIAL NOT NULL, "code" character varying(6) NOT NULL, "usedAt" TIMESTAMP, "expiredAt" TIMESTAMP NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_ed4913e5659b999881e7d69ed2c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "balances" ADD CONSTRAINT "FK_414a454532d03cd17f4ef40eae2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "balances" ADD CONSTRAINT "FK_3794b09097019882822a4a06c21" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trades" ADD CONSTRAINT "FK_bf4de59d2251e6de98ff8282922" FOREIGN KEY ("marketId") REFERENCES "markets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_7b92178727cd566805ae220ffd6" FOREIGN KEY ("marketId") REFERENCES "markets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userRoles" ADD CONSTRAINT "FK_fdf65c16d62910b4785a18cdfce" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userRoles" ADD CONSTRAINT "FK_5760f2a1066eb90b4c223c16a10" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "generateEmailCode" ADD CONSTRAINT "FK_4f1ad2254bbca88faaf73467326" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generateEmailCode" DROP CONSTRAINT "FK_4f1ad2254bbca88faaf73467326"`);
        await queryRunner.query(`ALTER TABLE "userRoles" DROP CONSTRAINT "FK_5760f2a1066eb90b4c223c16a10"`);
        await queryRunner.query(`ALTER TABLE "userRoles" DROP CONSTRAINT "FK_fdf65c16d62910b4785a18cdfce"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_7b92178727cd566805ae220ffd6"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "trades" DROP CONSTRAINT "FK_bf4de59d2251e6de98ff8282922"`);
        await queryRunner.query(`ALTER TABLE "balances" DROP CONSTRAINT "FK_3794b09097019882822a4a06c21"`);
        await queryRunner.query(`ALTER TABLE "balances" DROP CONSTRAINT "FK_414a454532d03cd17f4ef40eae2"`);
        await queryRunner.query(`DROP TABLE "generateEmailCode"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "userRoles"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "markets"`);
        await queryRunner.query(`DROP TABLE "trades"`);
        await queryRunner.query(`DROP TABLE "balances"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
    }

}
