import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRefreshTokenTable1730191568935 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS refresh_token`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE refresh_token (
              id SERIAL PRIMARY KEY,
              token VARCHAR(255) NOT NULL,
              user_id INT NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `);
    }

}
