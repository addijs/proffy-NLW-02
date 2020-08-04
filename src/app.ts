import express from 'express';

class App {
	server: express.Application;

	constructor() {
		this.server = express();
	}
}

export default new App().server;