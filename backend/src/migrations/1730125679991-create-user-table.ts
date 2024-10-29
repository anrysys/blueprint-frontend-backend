import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1730125679991 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`CREATE TABLE "user" (
            id SERIAL4 NOT NULL,
            username VARCHAR NULL,
            email VARCHAR NOT NULL,
            password VARCHAR NOT NULL,
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id)
        )`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" (email)`);
        await queryRunner.query(`CREATE TABLE "post" (
            id SERIAL4 NOT NULL,
            title VARCHAR NOT NULL,
            content VARCHAR NOT NULL,
            "userId" INT4 NULL,
            CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY (id)
        )`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
