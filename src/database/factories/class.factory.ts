import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Class } from '../entities/Class'

define(Class, (faker: typeof Faker) => {
	const randomIndex = faker.random.number(7);
	const cost = faker.commerce.price(0, 300, 2);
	const subject = [
		'Matemática', 
		'Português', 
		'Geografia', 
		'História',
		'Física',
		'Química',
		'Biologia',
		'Inglês'
	];

	const classEntity = new Class();
	
	classEntity.cost = Number(cost);
	classEntity.subject = subject[randomIndex];
	
  return classEntity;
});