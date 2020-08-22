import ServerSetup from '../src/app';
import request from 'supertest';

const server = new ServerSetup();

beforeAll(async () => {
	await server.init();
	global.testRequest = request(server.getApp());
});

afterAll(async () => {
	await server.close();
});