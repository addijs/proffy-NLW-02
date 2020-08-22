import {Entity, PrimaryGeneratedColumn, Column, OneToOne, BeforeInsert, AfterLoad} from "typeorm";
import { Class } from './Class';
import { Connection } from './Connection';
import { Credentials } from './Credentials';

@Entity('Users')
export class User {

	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column()
	first_name: string;
	
	@Column()
	last_name: string;

	@Column({ nullable: true })
	avatar: string;

	@Column({ nullable: true })
	bio: string;

	@Column({ nullable: true })
	whatsapp: string;

	@Column({ nullable: true })
	token: string;

	@OneToOne(type => Class, classItem => classItem.user)
	class: Class;

	@OneToOne(type => Connection, connection => connection.user)
	connection: Connection;

	@OneToOne(type => Credentials, credentials => credentials.user)
	credentials: Credentials;
}
