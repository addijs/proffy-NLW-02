import request from 'supertest';
import app from '../../src/app';

export async function createUser() {
	const newUser = {
		first_name: 'Fulano',
		last_name: 'de Teste',
		email: 'fulano@gmail.com',
		password: 'fulano123'
	}

	const res = await request(app).post('/user').send(newUser);

	return {
		res,
		fakeEmail: newUser.email,
		fakePassword: newUser.password
	}
}

export async function createUserAndLogin() {
	const { fakeEmail, fakePassword } = await createUser();

	const res = await request(app)
		.post('/login')
		.send({
			email: fakeEmail,
			password: fakePassword
		});

	return res;
}