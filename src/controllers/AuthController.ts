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

		const isEqual = await bcrypt.compare(userInfo.password, user.password);

		if(!isEqual) {
			return res.status(401).json({
				error: "Wrong password."
			});
		}

		const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, {
			expiresIn: '5h'
		});

		await db('users')
			.where('id', user.id)
			.update({
				token
			});
		
		delete user.password;
		
		const authenticatedUser = {
			...user,
			token 
		}

		return res.status(200).json(authenticatedUser);
	}

	async logout(req: CustomBodyRequest, res: Response) {
		const userId = res.locals.id;

		try {
			await db('users')
				.where('id', userId)
				.update({
					token: ''
				});

			res.sendStatus(200);
		} catch(err) {
			res.status(400).json({
				error: 'Unexpected error on logout'
			});
		}
	}
}