import request from 'supertest';
import app from '../../src/app';

export async function createUser(email: string, password = 'fulano123') {
	const newUser = {
		first_name: 'Fulano',
		last_name: 'de Teste',
		email,
		password 
	}

	const res = await request(app).post('/user').send(newUser);

	return {
		res,
		fakeEmail: newUser.email,
		fakePassword: newUser.password
	}
}

export async function createUserAndLogin(email: string) {
	const { fakeEmail, fakePassword } = await createUser(email);

	const res = await request(app)
		.post('/login')
		.send({
			email: fakeEmail,
			password: fakePassword
		});

	return res;
}