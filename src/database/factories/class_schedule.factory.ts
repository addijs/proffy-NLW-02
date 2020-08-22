import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { ClassSchedule } from '../entities/ClassSchedule'

define(ClassSchedule, (faker: typeof Faker) => {
	const week_day = faker.random.number(6);
	const from = faker.random.number({ min: 1, max: 20 });
	const to = faker.random.number({ min: from+1, max: 21 });

	const classSchedule = new ClassSchedule();

	classSchedule.week_day = week_day;
	classSchedule.from = from * 60;
	classSchedule.to = to * 60;
	
  return classSchedule;
});