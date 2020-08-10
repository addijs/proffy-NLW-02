import request from 'supertest';
import db from '../../src/database/db';
import app from '../../src/app';
import { createUser, createUserAndLogin } from '../utils/utils';

describe('Auth tests', () => {
	beforeAll(() => {
		return db.migrate.latest();
	});

	beforeEach(() => {
		return db('users').truncate();
	});

	it('should return jwt token when authenticated', async () => {
		const res = await createUserAndLogin();

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('token');
	});

	it('should NOT be able to authenticate a user with an unknown e-mail', async () => {
		await createUser();

		const res = await request(app)
			.post('/login')
			.send({
				email: 'blabla@a.com',
				password: 'asdasd'
			});

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('error');
	});

	it('should NOT be able to authenticate a user with a wrong password', async () => {
		const { fakeEmail } = await createUser();

		const res = await request(app)
			.post('/login')
			.send({
				email: fakeEmail,
				password: 'adelso'
			});

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('error');
	});

	it('should be able to access private routes when authenticated', async () => {
		const tokenResponse = await createUserAndLogin();

		const res = await request(app)
			.get('/user')
			.set('Authorization', `Bearer ${tokenResponse.body.token}`);
		
		expect(res.status).toBe(200);
	});

	it('should NOT be able to access private routes without a token', async () => {
		const res = await request(app).get('/classes');

		expect(res.status).toBe(401);
		expect(res.body).toMatchObject({
			error: 'Token not provided'
		});
	});

	it('should NOT be able to access private routes with an invalid token', async () => {
		const res = await request(app)
			.get('/classes')
			.set('Authorization', `Bearer 123123123132`);
		
		expect(res.status).toBe(401);
		expect(res.body).toMatchObject({
			error: 'Invalid token'
		});
	});

	afterAll(done => {
		return db.migrate.rollback()
			.then(() => {
				db.destroy();
				done();
			})
	});
});