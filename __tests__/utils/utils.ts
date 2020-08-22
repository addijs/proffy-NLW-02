export async function createUser(email: string, password: string) {
	const newUser = {
		first_name: 'Fulano',
		last_name: 'de Teste',
		credentials: {
			email,
			password
		}
	}

	const res = await global.testRequest.post('/user').send(newUser);

	return res;
}

export async function loginUser(email: string, password: string) {
	const res = await global.testRequest
		.post('/login')
		.send({
			email,
			password
		});

	return res;
}

export async function createUserAndLogin(email: string, password: string) {
	await createUser(email, password);

	const res = await loginUser(email, password);

	return res;
}