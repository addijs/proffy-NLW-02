import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';

interface Controllers {
	// Add new controllers here
	ClassesController: ClassesController;
	ConnectionsController: ConnectionsController;
}

class Routes {
	router: express.Router;
	private controllers: Controllers;

	constructor() {
		this.router = express.Router();
		this.controllers = {
			// Instance new controllers here
			ClassesController: new ClassesController(),
			ConnectionsController: new ConnectionsController()
		}
		this.init();
	}

	private init() {
		this.router.post('/classes', this.controllers.ClassesController.create);
		this.router.get('/classes', this.controllers.ClassesController.index);

		this.router.post('/connections', this.controllers.ConnectionsController.create);
		this.router.get('/connections', this.controllers.ConnectionsController.index);
	}
}

export default new Routes().router;