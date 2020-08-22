import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert} from "typeorm";
import { Class } from './Class';

@Entity('Class_Schedules')
export class ClassSchedule {

	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	week_day: number;

	@Column()
	from: number;

	@Column()
	to: number;

	@ManyToOne(type => Class, classItem => classItem.schedule)
	@JoinColumn({ name: 'class_id' })
	class: Class;
}
