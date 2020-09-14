import { Request, Response, NextFunction } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../database/entities/User';
import { Class } from '../database/entities/Class';
import { ClassSchedule } from '../database/entities/ClassSchedule';
import { Controller, Get, Post, Put, Delete, ClassMiddleware, ClassErrorMiddleware } from '@overnightjs/core';
import authMiddleware from '../middleware/AuthMiddleware';
import errorMiddleware from '../middleware/ErrorHandlerMiddleware';
import { InternalError } from '../middleware/Error/APIExceptionHandler';

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

@Controller('classes')
@ClassMiddleware(authMiddleware)
@ClassErrorMiddleware(errorMiddleware)
export class ClassesController {
	constructor(
		private classRepository = getRepository(Class),
		private classScheduleRepository = getRepository(ClassSchedule),
	) { }

	@Get('all')
	index = async (req: Request, res: Response, next: NextFunction) => {
		const userId = res.locals.id;
		const currentPage = Number(req.query.page);

		// const week_day = Number(req.query.week_day);
		// const subject = req.query.subject as string;
		// const time =  req.query.time as string;

		try {
			const storagedClasses = await this.classRepository.find({ relations: ['user'] });

			if (!storagedClasses) {
				return res.status(200).json([]);
			}

			const filteredStoragedClasses = storagedClasses.map(classItem => {
				delete classItem.user.id;
				delete classItem.user.token;
				return classItem;
			});

			return res.status(200).json(filteredStoragedClasses);

		} catch (err) {
			return next(new InternalError('listining classes'));
		}
	}

	@Post()
	create = async (req: CustomClassesRequest<IClassesInfo>, res: Response, next: NextFunction) => {
		const user_id = res.locals.id;

		const {
			subject,
			cost,
			schedule
		} = req.body;

		try {

			// Creating a transaction
			await getConnection().transaction(async transactionalEntityManager => {
				const [classUser] = await transactionalEntityManager.findByIds(User, [user_id]);

				const classEntity = transactionalEntityManager.create(Class);
				classEntity.subject = subject;
				classEntity.cost = cost;
				classEntity.user = classUser;

				const insertedClass = await transactionalEntityManager.save(classEntity);

				const classSchedule = schedule.map(scheduleItem => {
					const classScheduleObject = {
						class: insertedClass,
						week_day: scheduleItem.week_day,
						from: convertHoursToMinutes(scheduleItem.from),
						to: convertHoursToMinutes(scheduleItem.to)
					}

					return transactionalEntityManager
						.getRepository(ClassSchedule)
						.create(classScheduleObject);
				});

				await transactionalEntityManager.save(classSchedule);
			});

			return res.sendStatus(201);
		} catch (err) {
			return next(new InternalError('creating a new class'));
		}
	}

	@Get('user')
	getClass = async (req: Request, res: Response, next: NextFunction) => {
		const userId = res.locals.id;

		try {
			const userClasses = await this.classRepository.find({
				where: {
					user: { id: userId }
				}
			});

			if (userClasses.length === 0) {
				return res.status(200).json({
					subject: '',
					cost: '',
					schedule: []
				});
			}

			return res.status(200).json(userClasses);

		} catch (err) {
			return next(new InternalError('getting a class'));
		}

	}

	@Put()
	update = async (req: CustomClassesRequest<{
		class_id: number;
		newSchedule: IScheduleItem[]
	}>, res: Response, next: NextFunction) => {

		const { class_id, newSchedule } = req.body;

		try {
			// const classAboutToUpdate = await this.classRepository.preload({ id: class_id });

			const schedule = newSchedule.map(scheduleItem => {
				const classScheduleObject = {
					class: this.classRepository.create({ id: class_id }),
					week_day: scheduleItem.week_day,
					from: convertHoursToMinutes(scheduleItem.from),
					to: convertHoursToMinutes(scheduleItem.to)
				}

				return this.classScheduleRepository.create(classScheduleObject);
			});

			await this.classScheduleRepository.delete({ class: { id: class_id } });
			await this.classScheduleRepository.save(schedule);

			res.sendStatus(200);
		} catch (err) {
			return next(new InternalError('updating a class'));
		}
	}

	@Delete()
	delete = async (req: Request, res: Response, next: NextFunction) => {
		const userId = res.locals.id;

		try {
			await this.classRepository.delete({ user: { id: userId } });

			return res.sendStatus(200);

		} catch (err) {
			return next(new InternalError('deleting a class'));
		}
	}
}