import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Class1597779199284 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.createTable(new Table({
				name: 'Classes',
				columns: [
					{
						name: 'id',
						type: 'integer',
						isGenerated: true,
						generationStrategy: 'increment',
						isPrimary: true
					},
					{
						name: 'subject',
						type: 'varchar',
						length: '20'
					},
					{
						name: 'cost',
						type: 'float'
					},
					{
						name: 'user_id',
						type: 'string',
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
			await queryRunner.dropTable('Classes')
    }

}
