import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from './User';
import { ClassSchedule } from './ClassSchedule';

@Entity('Classes')
export class Class {

	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	subject: string;

	@Column()
	cost: number;

	@OneToOne(type => User, user => user.classItem)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@OneToMany(type => ClassSchedule, classSchedule => classSchedule.class, {
		eager: true
	})
	schedule: ClassSchedule[];
}
