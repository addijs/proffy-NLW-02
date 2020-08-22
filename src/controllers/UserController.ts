import { Request, Response } from 'express';
import { User } from '../database/entities/User';
import { Credentials } from '../database/entities/Credentials';
import { getRepository, getConnection } from 'typeorm';

interface IUser {
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

export default class UserControler {
	constructor(
		private userRepository = getRepository(User)
	) {}

	create = async (req: CustomRequestBody, res: Response) => {
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

		} catch(err) {
			console.log(err);
			return res.status(400).json({
				error: 'Unexpected error while creating a new user'
			});
		}
	}

	async getUserById(req: Request, res: Response) {
		const userId = res.locals.id;

		// const [ user ] = await db('users').where('id', '=', userId);

		// delete user.password;
		// delete user.token;

		return res.status(200).json();
	}

	update = async (req: CustomRequestBody, res: Response) => {
		const dataToUpdate = req.body;

		// const dataToUpdateKeys = Object.getOwnPropertyNames(dataToUpdate);

		const userId = res.locals.id;

		try {
			await this.userRepository.save({ id: userId, ...dataToUpdate });

			const user = await this.userRepository.findOne(userId);

			return res.status(200).json(user);

		} catch(err) {

			return res.status(404).json({
				error: 'Unexpected error while updating user'
			});
		}
	}
}