import { createUserAndLogin, loginUser } from '../utils/utils';
import { getRepository } from 'typeorm';
import { User } from '../../src/database/entities/User';
import { Class } from '../../src/database/entities/Class';
import { ClassSchedule } from '../../src/database/entities/ClassSchedule';

describe('Classes tests', () => {
	// beforeEach(async () => {
	// 	await connection.truncateAll();
	// });

	it('should be able to a user create a class', async () => {
		const { body: user } = await createUserAndLogin('fulano@gmail.com', 'fulano123');

		const classInfo = {
			subject: "História",
			cost: 80,
			schedule: [
				{ week_day: 2, from: '18:00', to: '22:00' }
			]
		}

		const res = await global.testRequest
			.post('/classes')
			.set('Authorization', `Bearer ${user.token}`)
			.send(classInfo);

		expect(res.status).toBe(201);
		
		const [ userWithClass ] = await getRepository(User).findByIds([user.id], { relations: ['class'] });

		expect(userWithClass.class).toHaveProperty('subject', classInfo.subject);
		expect(userWithClass.class).toHaveProperty('cost', classInfo.cost);
		expect(userWithClass.class.schedule.length).toBe(1);
	});

	it('should be able to list user class', async () => {
		const { body: user } = await createUserAndLogin('fulano2@gmail.com', 'blabla123');

		const classInfo = {
			subject: "Geografia",
			cost: 50,
			schedule: [
				{ week_day: 2, from: '8:00', to: '15:00' },
				{ week_day: 4, from: '13:00', to: '18:00' }
			]
		}

		await global.testRequest
			.post('/classes')
			.set('Authorization', `Bearer ${user.token}`)
			.send(classInfo);

		const res = await global.testRequest
			.get('/classes/user')
			.set('Authorization', `Bearer ${user.token}`)

		expect(res.status).toBe(200);
		expect(res.body[0]).toHaveProperty('subject', 'Geografia');
		expect(res.body[0].schedule.length).toBe(2);
	});

	it('should be able to list all classes', async () => {
		const { body: user } = await createUserAndLogin('fulano3@gmail.com', 'OTerceiroFulano');

		const res = await global.testRequest
			.get('/classes/all')
			.query({
				page: '1'
			})
			.set('Authorization', `Bearer ${user.token}`);

		console.log(res.body);
		expect(res.status).toBe(200)
		expect(res.body.length).toBe(2);
	});

	it('should be able to update schedule', async () => {
		// user credentials from 2nd test
		const { body: { token } } = await loginUser('fulano2@gmail.com', 'blabla123');

		const res = await global.testRequest
			.put('/classes')
			.set('Authorization', `Bearer ${token}`)
			.send({
				class_id: 2,
				newSchedule: [
					{ week_day: 3, from: '12:00', to: '16:00' }
				]
			});
			
		expect(res.status).toBe(200);

		const [ updatedClass ] = await getRepository(Class).findByIds([2]);

		expect(updatedClass.schedule[0]).toHaveProperty('week_day', 3);
	});

	it('should be able to delete a class along with its schedule', async () => {
		// user credentials from 2nd test
		const { body: { id, token } } = await loginUser('fulano2@gmail.com', 'blabla123');

		const res = await global.testRequest
			.delete('/classes')
			.set('Authorization', `Bearer ${token}`);

		expect(res.status).toBe(200);

		const [ classes ] = await getRepository(Class).find({ user: { id }});
		const schedules = await getRepository(ClassSchedule).find();

		expect(classes).toBeUndefined();
		expect(schedules.length).toBe(1);
	});
});