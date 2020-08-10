import request from 'supertest';
import db from '../../src/database/db';
import app from '../../src/app';
import { createUserAndLogin } from '../utils/utils';

describe('Classes tests', () => {
	beforeAll(() => {
		return db.migrate.latest();
	});

	beforeEach(() => {
		return db('users').truncate();
	});

	it('should be able to a user create a class', async () => {
		const { body: user } = await createUserAndLogin();

		const classInfo = {
			user_id: user.id,
			subject: "Matemática",
			cost: 50,
			schedule: [
				{ week_day: 2, from: '8:00', to: '15:00' }
			]
		}

		const res = await request(app)
			.post('/classes')
			.set('Authorization', `Bearer ${user.token}`)
			.send(classInfo);

		expect(res.status).toBe(201);
	});

	it('should be able to list all classes', async () => {
		const { body: user } = await createUserAndLogin();

		const classInfo = {
			user_id: user.id,
			subject: 'Matemática',
			cost: 50,
			schedule: [
				{ week_day: 2, from: '8:00', to: '15:00' }
			]
		}

		await request(app)
			.post('/classes')
			.set('Authorization', `Bearer ${user.token}`)
			.send(classInfo);

		const res = await request(app)
			.get('/classes')
			.set('Authorization', `Bearer ${user.token}`);

		const [ classes ] = res.body;

		console.log(classes);

		expect(res.status).toBe(200);
		expect(classes.subject).toBe('Matemática');
		expect(classes.password).toBeUndefined();
	});

	afterAll(done => {
		return db.migrate.rollback()
			.then(() => {
				db.destroy();
				done();
			})
	});
});