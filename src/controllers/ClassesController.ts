import { Request, Response } from 'express';
import db from '../database/db';

function convertHoursToMinutes(time: string) {
	const [hour, minutes] = time.split(':').map(Number);
	
	const timeInMinutes = (hour * 60) + minutes;

	return timeInMinutes;
}

interface IScheduleItem {
	week_day: number;
	from: string;
	to: string;
}

interface IClassesInfo {
	name: string;
	avatar: string;
	whatsapp: string;
	bio: string;
	subject: string;
	cost: number;
	schedule: IScheduleItem[]
}

interface CustomBodyRequest<T> extends Request {
	body: T
}

export default class ClassesController {

	async index(req: Request, res: Response) {
		const week_day = Number(req.query.week_day);
		const subject = req.query.subject as string;
		const time =  req.query.time as string;

		try {
			if(!week_day || !subject || !time) {
				const classes = await db('classes')
					.join('users', 'classes.user_id', '=', 'users.id')
					.join('class_schedule', 'classes.id', '=', 'class_schedule.class_id')
					.select(
						'classes.*', 
						'users.first_name',
						'users.last_name',
						'users.bio',
						'users.avatar',
						'users.whatsapp',
					);
	
				return res.status(200).json(classes);
			}

			const timeInMinutes = convertHoursToMinutes(time);
	
			const classes = await db('classes')
				.join('users', 'classes.user_id', '=', 'users.id')
				.join('class_schedule', 'classes.id', '=', 'class_schedule.class_id')
				.where('classes.subject', '=', subject)
				.where('class_schedule.week_day', '=', week_day)
				.where('class_schedule.from', '<=', timeInMinutes)
				.where('class_schedule.to', '>', timeInMinutes)
				// .whereIn(week_day, function() {
				// 	this.select('week_day').from('class_schedule')
				// 	.whereRaw('`class_schedule`.`class_id` = `classes`.`id`');
				// })
				.select(
					'classes.*', 
					'users.first_name',
					'users.last_name',
					'users.bio',
					'users.avatar',
					'users.whatsapp',
				)
	
			return res.status(200).json(classes);
		} catch(err) {

			return res.status(400).json({
				error: 'Unexpected error while creating class'
			});
		}
	}

	async create(req: CustomBodyRequest<IClassesInfo>, res: Response) {
		const user_id = res.locals.id;

		const {
			subject,
			cost,
			schedule
		} = req.body;

		// Creating a transaction

		const trx = await db.transaction();

		try {
			// Adding user classes //
			
			const insertedClassesIds = await trx('classes').insert({
				user_id,
				subject,
				cost
			});

			// Adding user schedules //
			const class_id = insertedClassesIds[0];

			const classSchedule = schedule.map(scheduleItem => {
				return {
					class_id,
					week_day: scheduleItem.week_day,
					from: convertHoursToMinutes(scheduleItem.from),
					to: convertHoursToMinutes(scheduleItem.to)
				}
			})

			await trx('class_schedule').insert(classSchedule)

			await trx.commit();

			return res.sendStatus(201);
		} catch(err) {

			trx.rollback();

			return res.status(400).json({
				error: 'Unexpected error while creating new class'
			});
		}
	}
}