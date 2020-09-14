import { createUser, loginUser } from '../utils/utils';

describe('User tests', () => {
	it('should be able to create a user with an encrypted password', async () => {
		const res = await createUser('fulano@gmail.com', 'fulano123');

		expect(res.status).toBe(201);
	});

	it('should be able to load user info', async () => {
		const { body: { token } } = await loginUser('fulano@gmail.com', 'fulano123');

		const res = await global.testRequest
			.get('/users')
			.set('Authorization', `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('first_name');
		expect(res.body).toHaveProperty('last_name');
	});

	it('should be able to update user data', async () => {
		const { body: { token } } = await loginUser('fulano@gmail.com', 'fulano123');

		const dataToUpdate = {
			bio: "Mudando a bio",
			avatar: "aoisjdoasidj.jpg"
		}

		const res = await global.testRequest
			.put('/users')
			.set('Authorization', `Bearer ${token}`)
			.send(dataToUpdate);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('token', token);
	});
});