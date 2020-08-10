import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../database/db';
import { CustomBodyRequest } from './UserController';
import dotenv from 'dotenv';

dotenv.config();

export default class AuthController {
	async login(req: CustomBodyRequest, res: Response) {
		const userInfo = req.body;

		const [ user ] = await db('users').where('email', userInfo.email);

		if(!user) {
			return res.status(404).json({
				error: "We can't find that Proffy account"
			});
		}

		const comparedPassword = await bcrypt.compare(userInfo.password, user.password);

		if(!comparedPassword) {
			return res.status(401).json({
				error: "Wrong password."
			});
		}

		const authenticatedUser = {
			...user,
			token: jwt.sign(user.id, process.env.SECRET_KEY as string)
		}

		return res.status(200).json(authenticatedUser);
	}
}