import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/db';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if(!authHeader) {
		return res.status(401).json({
			error: 'Token not provided'
		});
	}

	const [, token] = authHeader.split(' ');

	jwt.verify(token, process.env.SECRET_KEY as string, async (err, decoded: any) => {
		if(err) {
			return res.status(401).json({
				error: 'Invalid token'
			});
		}

		try {
			const [ { token: storagedToken } ] = await db('users').where('id', decoded.id).select('token');

			if(token !== storagedToken) {
				return res.status(401).json({
					error: 'Invalid user token'
				});
			}

			res.locals.id = decoded.id;
			next();

		} catch(err) {

			return res.status(400).json({
				error: 'Unexpected error on token verification'
			});
		}
	})
}