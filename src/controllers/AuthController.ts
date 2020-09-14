import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { User } from '../database/entities/User';
import { Credentials } from '../database/entities/Credentials';
import dotenv from 'dotenv';
import { NotFoundError, WrongPasswordError, InternalError } from '../middleware/Error/APIExceptionHandler';
import { Controller, Post, ClassErrorMiddleware, Put, Middleware } from '@overnightjs/core';
import errorMiddleware from '../middleware/ErrorHandlerMiddleware';
import authMiddleware from '../middleware/AuthMiddleware';

dotenv.config();

interface ICredentials {
	email: string;
	password: string;
}

export interface CustomRequestBody extends Request {
	body: ICredentials;
}

@Controller('auth')
@ClassErrorMiddleware(errorMiddleware)
export class AuthController {
	constructor(
		private userRepository = getRepository(User),
		private credentialsRepository = getRepository(Credentials),
	) { }

	@Post('login')
	login = async (req: CustomRequestBody, res: Response, next: NextFunction) => {
		const { email: providedEmail, password: providedPassword } = req.body;

		try {
			const [userCredentials] = await this.credentialsRepository.find({
				where: {
					email: providedEmail
				},
				relations: ['user']
			});

			if (!userCredentials) {
				return next(new NotFoundError('User'));
			}

			const { password, user } = userCredentials;

			const isEqual = await bcrypt.compare(providedPassword, password);

			if (!isEqual) {
				return next(new WrongPasswordError());
			}

			const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, {
				expiresIn: '5h'
			});

			user.token = token;

			const authenticatedUser = await this.userRepository.save(user);

			return res.status(200).json(authenticatedUser);

		} catch (err) {
			return next(new InternalError('attempt login'));
		}
	}

	@Put('logout')
	@Middleware(authMiddleware)
	logout = async (req: CustomRequestBody, res: Response, next: NextFunction) => {
		const userId = res.locals.id;

		try {
			await this.userRepository.save({ id: userId, token: '' });

			return res.sendStatus(200);
		} catch (err) {
			return next(new InternalError('attempt logout'));
		}
	}
}