import { Request, Response } from 'express';
import db from '../database/connection';

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

		if(!week_day || !subject || !time) {
			return res.status(400).json({
				error: "Missing filter to search classes."
			});
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
			.select('classes.*', 'users.*')

		return res.json(classes);
	}

	async create(req: CustomBodyRequest<IClassesInfo>, res: Response) {
		const {
			name,
			avatar,
			whatsapp,
			bio,
			subject,
			cost,
			schedule
		} = req.body;

		// Creating a transaction

		const trx = await db.transaction();

		try {

			// Adding user //
			const insertedUsersIds = await trx('users').insert({
				name,
				avatar,
				whatsapp,
				bio
			});

			// Adding user classes //
			const user_id = insertedUsersIds[0];
			
			const insertedClassesIds = await trx('classes').insert({
				user_id,
				subject,
				cost,
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

			return res.status(201).send();
		} catch(err) {

			trx.rollback();

			return res.send(400).json({
				error: 'Unexpected error while creating new class'
			});
		}
	}
}