import connection from '../../src/database/db';
import { createUser, createUserAndLogin } from '../utils/utils';
import { getRepository } from 'typeorm';
import { User } from '../../src/database/entities/User';

describe('Auth tests', () => {
	beforeEach(async () => {
		await connection.truncateAll();
	});

	it('should return jwt token when authenticated', async () => {
		const res = await createUserAndLogin('fulano@gmail.com', 'fulano123');

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('token');
	});

	it('should NOT be able to authenticate a user with an unknown e-mail', async () => {
		await createUser('fulano@gmail.com', 'fulano123');

		const res = await global.testRequest
			.post('/auth/login')
			.send({
				email: 'blabla@a.com',
				password: 'asdasd'
			});

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('message', 'User not found');
	});

	it('should NOT be able to authenticate a user with a wrong password', async () => {
		await createUser('fulano@gmail.com', 'fulano123');

		const res = await global.testRequest
			.post('/auth/login')
			.send({
				email: 'fulano@gmail.com',
				password: 'adelso'
			});

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('message', 'Wrong password');
	});

	it('should be able to access private routes when authenticated', async () => {
		const tokenResponse = await createUserAndLogin('fulano@gmail.com', 'fulano123');

		console.log(tokenResponse.body);
		const res = await global.testRequest
			.get('/users')
			.set('Authorization', `Bearer ${tokenResponse.body.token}`);

		expect(res.status).toBe(200);
	});

	it('should NOT be able to access private routes without a token', async () => {
		const res = await global.testRequest.get('/classes');

		expect(res.status).toBe(403);
		expect(res.body).toHaveProperty('message', 'Token not provided');
	});

	it('should NOT be able to access private routes with an invalid token', async () => {
		const res = await global.testRequest
			.get('/classes')
			.set('Authorization', `Bearer 123123123132`);

		expect(res.status).toBe(403);
		expect(res.body).toHaveProperty('message', expect.stringContaining('Invalid token'));
	});

	it('should be able to sign out', async () => {
		const { body: { id, token } } = await createUserAndLogin('fulano@gmail.com', 'fulano123');

		const res = await global.testRequest
			.put('/auth/logout')
			.set('Authorization', `Bearer ${token}`)

		const userLoggedOut = await getRepository(User).findOne(id);

		expect(res.status).toBe(200);
		expect(userLoggedOut?.token).toBeFalsy();
	});
});