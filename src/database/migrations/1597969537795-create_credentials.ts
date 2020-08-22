import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createCredentials1597969537795 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.createTable(new Table({
				name: 'Credentials',
				columns: [
					{
						name: 'id',
						type: 'integer',
						isGenerated: true,
						generationStrategy: 'increment',
						isPrimary: true
					},
					{
						name: 'email',
						type: 'varchar',
						length: '100',
						isUnique: true
					},
					{
						name: 'password',
						type: 'varchar',
						length: '100'
					},
					{
						name: 'user_id',
						type: 'int',
						isUnique: true
					}
				],

				foreignKeys: [
					{
						columnNames: ['user_id'],
						referencedColumnNames: ['id'],
						referencedTableName: 'Users',
						onUpdate: 'CASCADE',
						onDelete: 'CASCADE'
					}
				]
			}))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.dropTable('Credentials');
    }

}
