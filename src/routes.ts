import express from 'express';
import ClassesController from './controllers/ClassesController';

interface Controllers {
	// Add new controllers here
	ClassesController: ClassesController;
}

class Routes {
	router: express.Router;
	private controllers: Controllers;

	constructor() {
		this.router = express.Router();
		this.controllers = {
			// Instance new controllers here
			ClassesController: new ClassesController()
		}
		this.init();
	}

	private init() {
		this.router.post('/classes', this.controllers.ClassesController.create);
		this.router.get('/classes', this.controllers.ClassesController.index);
	}
}

export default new Routes().router;