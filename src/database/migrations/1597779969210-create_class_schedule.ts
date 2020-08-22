import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createClassSchedule1597779969210 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.createTable(new Table({
				name: 'Class_Schedules',
				columns: [
					{
						name: 'id',
						type: 'integer',
						isGenerated: true,
						generationStrategy: 'increment',
						isPrimary: true
					},
					{
						name: 'week_day',
						type: 'int'
					},
					{
						name: 'from',
						type: 'int'
					},
					{
						name: 'to',
						type: 'int'
					},
					{
						name: 'class_id',
						type: 'integer',
					}
				],
				foreignKeys: [
					{
						columnNames: ['class_id'],
						referencedColumnNames: ['id'],
						referencedTableName: 'Classes',
						onUpdate: 'CASCADE',
						onDelete: 'CASCADE'
					}
				]
			}))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.dropTable('Class_Schedules');
    }

}
