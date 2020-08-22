import bcrypt from 'bcrypt';

describe('Encryption', () => {
	it('should be able to decrypt a string', async () => {
		const password = '123456';

		const encryptedPassword = await bcrypt.hash(password, 10);

		const res = await bcrypt.compare(password, encryptedPassword);

		expect(res).toBe(true);
	});
});