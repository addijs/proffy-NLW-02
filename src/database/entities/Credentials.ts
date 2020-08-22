import {Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, BeforeInsert} from "typeorm";
import bcrypt from 'bcrypt';
import { User } from './User';

@Entity('Credentials')
export class Credentials {

	@PrimaryGeneratedColumn('increment')
	id: number;
	
	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@OneToOne(type => User, user => user.credentials)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@BeforeInsert()
	async setPassword() {
		this.password = await bcrypt.hash(this.password, 10)
	}
}