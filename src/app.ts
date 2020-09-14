import express from 'express';
import cors from 'cors';
import connection from './database/db';
import { Server } from '@overnightjs/core';
import { AuthController } from './controllers/AuthController';
import { UserControler } from './controllers/UserController';
import { ClassesController } from './controllers/ClassesController';
import errorMiddleware from './middleware/ErrorHandlerMiddleware';

export class ServerSetup extends Server {
	constructor(
		private port = 3333
	) {
		super();
	}

	public getApp() {
		return this.app;
	}

	public startApp() {
		this.app.listen(this.port, () => {
			console.log('Server running...');
		});
	}

	async init() {
		await this.connectToDatabase();
		this.initializeMiddlewares();
		this.initializeControllers();
	}

	async close() {
		await connection.close();
	}

	private async connectToDatabase() {
		await connection.create();
	}

	private initializeMiddlewares() {
		this.app.use(express.json());
		this.app.use(cors());
	}

	private initializeControllers() {
		const authController = new AuthController();
		const userController = new UserControler();
		const classesController = new ClassesController();

		this.addControllers([
			authController,
			userController,
			classesController
		]);
	}
}