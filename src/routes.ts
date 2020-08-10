import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
import UserControler from './controllers/UserController';
import AuthController from './controllers/AuthController';
import { authMiddleware } from './middleware/auth';

interface Controllers {
	// Add new controllers here
	AuthController: AuthController;
	UserController: UserControler;
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
			AuthController: new AuthController(),
			UserController: new UserControler(),
			ClassesController: new ClassesController(),
			ConnectionsController: new ConnectionsController()
		}
		this.init();
	}

	private init() {
		this.router.post('/user', this.controllers.UserController.create);
		this.router.post('/login', this.controllers.AuthController.login);

		this.router.use(authMiddleware);

		this.router.get('/user', this.controllers.UserController.getUserById);
		this.router.put('/user', this.controllers.UserController.update);

		this.router.post('/classes', this.controllers.ClassesController.create);
		this.router.get('/classes', this.controllers.ClassesController.index);

		this.router.post('/connections', this.controllers.ConnectionsController.create);
		this.router.get('/connections', this.controllers.ConnectionsController.index);
	}
}

export default new Routes().router;