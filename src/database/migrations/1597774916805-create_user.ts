import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createUser1597774916805 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.createTable(new Table({
				name: 'Users',
				columns: [
					{
						name: 'id',
						type: 'integer',
						isGenerated: true,
						generationStrategy: 'increment',
						isPrimary: true,
					},
					{
						name: 'first_name',
						type: 'varchar',
						length: '100'
					},
					{
						name: 'last_name',
						type: 'varchar',
						length: '100'
					},
					{
						name: 'avatar',
						type: 'varchar',
						isNullable: true
					},
					{
						name: 'bio',
						type: 'varchar',
						isNullable: true
					},
					{
						name: 'whatsapp',
						type: 'varchar',
						length: '20',
						isNullable: true
					},
					{
						name: 'token',
						type: 'varchar',
						isNullable: true
					}
				]
			}));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.dropTable('Users');
    }

}
