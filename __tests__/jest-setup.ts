import { ServerSetup } from '../src/app';
import request from 'supertest';
import connection from '../src/database/db';

const setup = new ServerSetup();

beforeAll(async () => {
	await setup.init();
	await connection.migrate();

	global.testRequest = request(setup.getApp());
});

afterAll(async () => {
	await connection.dropDatabase();
	await setup.close();
});