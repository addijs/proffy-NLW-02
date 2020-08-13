import { Request, Response } from 'express';
import db from '../database/db';
import { Class } from '../database/models/Class';

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
	subject: string;
	cost: number;
	schedule: IScheduleItem[]
}

interface CustomClassesRequest<T> extends Request {
	body: T
}

export default class ClassesController {

	async index(req: Request, res: Response) {
		const userId = res.locals.id;
		const currentPage = Number(req.query.page);

		// const week_day = Number(req.query.week_day);
		// const subject = req.query.subject as string;
		// const time =  req.query.time as string;

		try {
			const storagedClasses = (await Class.query()
			.withGraphJoined({
				user: true,
				class_schedules: true
			})).map(classItem => classItem.toJSON());

			if(!storagedClasses) {
				return res.status(200).json([]);
			}
			
			return res.status(200).json(storagedClasses);

		} catch(err) {
			
			return res.status(400).json({
				error: 'Unexpected error while listing classes'
			});
		}
	}

	async create(req: CustomClassesRequest<IClassesInfo>, res: Response) {
		const user_id = res.locals.id;

		const {
			subject,
			cost,
			schedule
		} = req.body;

		// Creating a transaction

		const trx = await db.transaction();

		try {
			// Adding user class //
			
			const [ insertedClassId ] = await trx('classes').insert({
				user_id,
				subject,
				cost
			});

			// Adding user schedules //
			const class_id = insertedClassId;

			const classSchedule = schedule.map(scheduleItem => {
				return {
					class_id,
					week_day: scheduleItem.week_day,
					from: convertHoursToMinutes(scheduleItem.from),
					to: convertHoursToMinutes(scheduleItem.to)
				}
			});

			await trx('class_schedule').insert(classSchedule);

			await trx.commit();

			return res.sendStatus(201);
		} catch(err) {

			trx.rollback();

			return res.status(400).json({
				error: 'Unexpected error while creating new class'
			});
		}
	}

	async getClass(req: Request, res: Response) {
		const userId = res.locals.id;

		try {
			const userClasses = await db('classes')
				.join('class_schedule', 'classes.id', '=', 'class_schedule.class_id')
				.where('classes.user_id', userId);
	
			if(userClasses.length === 0) {
				return res.status(200).json({
					subject: '',
					cost: '',
					schedule: []
				});
			}
	
			const schedule = userClasses.map(userClass => {
				return {
					week_day: userClass.week_day,
					from: userClass.from,
					to: userClass.to
				}
			});
	
			return res.status(200).json({
				class_id: userClasses[0].class_id,
				subject: userClasses[0].subject,
				cost: userClasses[0].cost,
				schedule
			});

		} catch(err) {
			res.status(400).json({
				error: 'Unexpected error while getting class'
			})
		}

	}

	async update(req: CustomClassesRequest<{
		class_id: number;
		newSchedule: IScheduleItem[]
	}>, res: Response) {

		const { class_id, newSchedule } = req.body;

		try {
			await db('class_schedule')
				.where('class_id', class_id)
				.del();

			const schedule = newSchedule.map(scheduleItem => {
				return {
					class_id,
					week_day: scheduleItem.week_day,
					from: convertHoursToMinutes(scheduleItem.from),
					to: convertHoursToMinutes(scheduleItem.to)
				}
			});

			await db('class_schedule').insert(schedule);

			res.sendStatus(200);
		} catch(err) {
			return res.status(400).json({
				error: 'Unexpected error while updating class'
			});
		}
	}

	async delete(req: Request, res: Response) {
		const userId = res.locals.id;

		try {
			await db('classes')
				.where('classes.user_id', userId)
				.del()

			res.sendStatus(200);

		} catch(err) {

			res.status(400).json({
				error: 'Unexpected error while deleting class'
			});
		}
	}
}