import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createConnections1597780072848 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.createTable(new Table({
				name: 'Connections',
				columns: [
					{
						name: 'id',
						type: 'integer',
						isGenerated: true,
						generationStrategy: 'increment',
						isPrimary: true
					},
					{
						name: 'created_at',
						type: 'timestamptz',
						default: 'now()',
					},
					{
						name: 'user_id',
						type: 'int',
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
			await queryRunner.dropTable('Connections');
    }

}
