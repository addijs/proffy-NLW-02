import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from '../database/db';

interface User {
	first_name?: string;
	last_name?: string;
	email?: string;
	password?: string;
	bio?: string;
	avatar?: string;
	whatsapp?: string;
}

export interface CustomBodyRequest extends Request {
	body: User;
}

export default class UserControler {
	async create(req: CustomBodyRequest, res: Response) {
		const user = req.body;
		
		try {
			const encryptedPassword = await bcrypt.hash(user.password, 10);
			
			await db('users').insert({
				...user,
				password: encryptedPassword
			});

			return res.sendStatus(201);

		} catch(err) {

			return res.status(400).json({
				error: 'Unexpected error while creating a new user'
			});
		}
	}

	async getUserById(req: Request, res: Response) {
		const userId = res.locals.id;

		const [ user ] = await db('users').where('id', '=', userId);
		
		return res.status(200).json(user);
	}

	async update(req: CustomBodyRequest, res: Response) {
		const dataToUpdate = req.body;

		const dataToUpdateKeys = Object.getOwnPropertyNames(dataToUpdate);

		const userId = res.locals.id;

		try {
			await db('users').where('id', userId).update({
				...dataToUpdate
			});

			const [updatedData] = await db('users').where('id', userId).select(dataToUpdateKeys);

			return res.status(200).json(updatedData);

		} catch(err) {

			return res.status(404).json({
				error: 'Unexpected error while updating user'
			});
		}
	}
}