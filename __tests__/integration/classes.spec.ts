import request from 'supertest';
import db from '../../src/database/db';
import app from '../../src/app';
import { createUserAndLogin } from '../utils/utils';

describe('Classes tests', () => {
	beforeAll(() => {
		return db.raw('PRAGMA foreign_keys = ON')
			.then(() => db.migrate.latest())
			.then(() => db.seed.run());
	});

	// beforeEach(() => {
	// 	return db('users').truncate()
	// 		.then(() => db('classes').truncate())
	// 		.then(() => db('class_schedule').truncate());
	// });

	it('should be able to a user create a class', async () => {
		const { body: user } = await createUserAndLogin('fulano@gmail.com');

		const classInfo = {
			subject: "História",
			cost: 80,
			schedule: [
				{ week_day: 2, from: '18:00', to: '22:00' }
			]
		}

		const res = await request(app)
			.post('/classes')
			.set('Authorization', `Bearer ${user.token}`)
			.send(classInfo);

		expect(res.status).toBe(201);
	});

	it('should be able to list user schedule', async () => {
		const { body: user } = await createUserAndLogin('fulano2@gmail.com');

		const classInfo = {
			subject: "Geografia",
			cost: 50,
			schedule: [
				{ week_day: 2, from: '8:00', to: '15:00' },
				{ week_day: 4, from: '13:00', to: '18:00' }
			]
		}

		await request(app)
			.post('/classes')
			.set('Authorization', `Bearer ${user.token}`)
			.send(classInfo);

		const res = await request(app)
			.get('/classes/user')
			.set('Authorization', `Bearer ${user.token}`)

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('subject', 'Geografia');
		expect(res.body.schedule.length).toBe(2);
	});

	it('should be able to list all classes', async () => {
		const { body: user } = await createUserAndLogin('fulano3@gmail.com');

		const res = await request(app)
			.get('/classes/all')
			.query({
				page: '1'
			})
			.set('Authorization', `Bearer ${user.token}`);

		expect(res.status).toBe(200)
		expect(res.body.length).toBe(8);
	});

	it('should be able to update schedule', async () => {
		// user credentials from 2nd test
		const { body: { token } } = await request(app)
			.post('/login')
			.send({
				email: 'fulano2@gmail.com',
				password: 'fulano123'
			});

		const res = await request(app)
			.put('/classes')
			.set('Authorization', `Bearer ${token}`)
			.send({
				class_id: 8,
				newSchedule: [
					{ week_day: 3, from: '12:00', to: '16:00' }
				]
			});
		
		expect(res.status).toBe(200);
	});

	it('should be able to delete a class along with its schedule', async () => {
		// user credentials from 2nd test
		const { body: { token } } = await request(app)
		.post('/login')
		.send({
			email: 'fulano2@gmail.com',
			password: 'fulano123'
		});

		const res = await request(app)
			.delete('/classes')
			.set('Authorization', `Bearer ${token}`);

		expect(res.status).toBe(200);
	});

	afterAll(done => {
		return db.migrate.rollback()
			.then(() => {
				db.destroy();
				done();
			})
	});
});