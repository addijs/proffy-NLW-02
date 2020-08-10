import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
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

	try {
		const decoded = jwt.verify(token, (process.env.SECRET_KEY) as string);
		
		res.locals.id = decoded;
		
		return next();
	} catch(err) {
		return res.status(401).json({
			error: 'Invalid token'
		})
	}
}