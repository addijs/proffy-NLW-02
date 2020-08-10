import request from 'supertest';
import db from '../../src/database/db';
import app from '../../src/app';
import { createUser, createUserAndLogin } from '../utils/utils';

describe('User tests', () => {
	beforeAll(() => {
		return db.migrate.latest();
	});

	beforeEach(() => {
		return db('users').truncate();
	});

	it('should be able to create a user with an encrypted password', async () => {
		const { res } = await createUser();

		expect(res.status).toBe(201);
	});

	it('should be able to update user data', async () => {
		const { body: { token } } = await createUserAndLogin();

		const userDataToUpdate = {
			bio: "Mudando a bio",
			avatar: "aoisjdoasidj.jpg"
		}

		const res = await request(app)
			.put('/user')
			.set('Authorization', `Bearer ${token}`)
			.send(userDataToUpdate);

		expect(res.status).toBe(200);
		expect(res.body).toMatchObject(userDataToUpdate);
	});

	afterAll(done => {
		return db.migrate.rollback()
			.then(() => {
				db.destroy();
				done();
			});
	});
});