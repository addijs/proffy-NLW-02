import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { User } from '../database/entities/User';
import { Credentials } from '../database/entities/Credentials';
import dotenv from 'dotenv';

dotenv.config();

interface ICredentials {
	email: string;
	password: string;
}

export interface CustomRequestBody extends Request {
	body: ICredentials;
}

export default class AuthController {
	private userRepository = getRepository(User);
	private credentialsRepository = getRepository(Credentials)
	
	login = async (req: CustomRequestBody, res: Response) => {
		const { email: providedEmail, password: providedPassword } = req.body;

		try {
			const [ userCredentials ] = await this.credentialsRepository.find({
				where: {
					email: providedEmail
				},
				relations: ['user']
			})

			if(!userCredentials) {
				return res.status(404).json({
					error: "We can't find that Proffy account."
				});
			}
	
			const { password, user } = userCredentials;
			
			const isEqual = await bcrypt.compare(providedPassword, password);
	
			if(!isEqual) {
				return res.status(401).json({
					error: "Wrong password."
				});
			}
	
			const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, {
				expiresIn: '5h'
			});
	
			user.token = token;
			
			const authenticatedUser = await this.userRepository.save(user);

			return res.status(200).json(authenticatedUser);

		} catch(err) {
			console.log(err);
			res.status(400).json({
				error: 'Unexpected error on login'
			});
		}
	}

	logout = async (req: CustomRequestBody, res: Response) => {
		const userId = res.locals.id;

		try {
			await this.userRepository.save({ id: userId, token: '' });

			res.sendStatus(200);
		} catch(err) {
			res.status(400).json({
				error: 'Unexpected error on logout'
			});
		}
	}
}