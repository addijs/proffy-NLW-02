import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { ClassSchedule } from '../entities/ClassSchedule';
import { Class } from '../entities/Class';

export default class CreateClassSchedules implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
		const classEntity = new Class();
		
		for(let i = 1; i <= 4; i++) {
			classEntity.id = i;
			await factory(ClassSchedule)().createMany(2, { class: classEntity });
		}
  }
}