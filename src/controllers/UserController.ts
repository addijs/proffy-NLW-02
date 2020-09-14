import { Request, Response, NextFunction } from 'express';
import { User } from '../database/entities/User';
import { Credentials } from '../database/entities/Credentials';
import { getRepository, getConnection } from 'typeorm';
import { NotFoundError, InternalError } from '../middleware/Error/APIExceptionHandler';
import authMiddleware from '../middleware/AuthMiddleware';
import { Controller, Post, Get, Middleware, Put, ClassErrorMiddleware } from '@overnightjs/core';
import errorMiddleware from '../middleware/ErrorHandlerMiddleware';

export interface IUser {
	id?: string;
	first_name: string;
	last_name: string;
	credentials: {
		email: string;
		password: string;
	}
}

export interface CustomRequestBody extends Request {
	body: IUser;
}

@Controller('users')
@ClassErrorMiddleware(errorMiddleware)
export class UserControler {
	constructor(
		private userRepository = getRepository(User)
	) { }

	@Post()
	create = async (req: CustomRequestBody, res: Response, next: NextFunction) => {
		const { first_name, last_name, credentials: { email, password } } = req.body;

		try {
			await getConnection().transaction(async transactionalEntityManager => {
				const userEntity = transactionalEntityManager.create(User, {
					first_name,
					last_name
				});

				const credentialsEntity = transactionalEntityManager.create(Credentials, {
					email,
					password
				});

				credentialsEntity.user = userEntity;

				await transactionalEntityManager.save(userEntity);
				await transactionalEntityManager.save(credentialsEntity);
			});

			return res.sendStatus(201);

		} catch (err) {
			return next(new InternalError('creating a new user'));
		}
	}

	@Get()
	@Middleware(authMiddleware)
	getUserById = async (req: Request, res: Response, next: NextFunction) => {
		const userId = res.locals.id;

		try {
			const user = await this.userRepository.findOne(userId, {
				relations: ['classItem']
			});

			if (!user) {
				return next(new NotFoundError('User'));
			}

			delete user?.id;
			delete user?.token;

			return res.status(200).json(user);
		} catch (err) {
			return next(new InternalError('finding User'));
		}

	}

	@Put()
	@Middleware(authMiddleware)
	update = async (req: CustomRequestBody, res: Response, next: NextFunction) => {
		const dataToUpdate = req.body;

		// const dataToUpdateKeys = Object.getOwnPropertyNames(dataToUpdate);

		const userId = res.locals.id;

		try {
			await this.userRepository.save({ id: userId, ...dataToUpdate });

			const user = await this.userRepository.findOne(userId);

			return res.status(200).json(user);

		} catch (err) {
			return next(new InternalError('updating User'));
		}
	}
}