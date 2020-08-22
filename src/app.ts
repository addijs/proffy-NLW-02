import express from 'express';
import cors from 'cors';
import Routes from './routes';
import connection from './database/db';

class ServerSetup {
	private app: express.Application;

	constructor(private port = 3333) {
		this.app = express();
	}

	getApp() {
		return this.app;
	}

	startApp() {
		this.app.listen(this.port, () => {
			console.log('Server running...');
		})
	}

	async init() {
		await this.database();
		this.middlewares();
		this.routes();
	}

	async close() {
		await connection.close();
	}

	private async database() {
		await connection.create();
	}

	private middlewares() {
		this.app.use(express.json());
		this.app.use(cors());
	}

	private routes() {
		const routes = new Routes().router;
		this.app.use(routes);
	}
}

export default ServerSetup;