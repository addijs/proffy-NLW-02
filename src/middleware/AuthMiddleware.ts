import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getRepository } from 'typeorm';
import { User } from '../database/entities/User';
import { InternalError, NotProvidedTokenError, InvalidTokenError } from './Error/APIExceptionHandler';

dotenv.config();

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
	const userRepository = getRepository(User);

	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return next(new NotProvidedTokenError());
	}

	const [, token] = authHeader.split(' ');

	jwt.verify(token, process.env.SECRET_KEY as string, async (err, decoded: any) => {
		if (err) {
			return next(new InvalidTokenError(err.message));
		}

		try {
			const [{ token: storagedToken }] = await userRepository.findByIds([decoded.id]);

			if (token !== storagedToken) {
				return next(new InvalidTokenError('Expired token'));
			}

			res.locals.id = decoded.id;
			next();

		} catch (err) {
			return next(new InternalError('token verification'));
		}
	})
}