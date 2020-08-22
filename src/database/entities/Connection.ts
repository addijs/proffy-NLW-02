import {Entity, CreateDateColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm";
import { User } from './User';

@Entity('Connections')
export class Connection {

	@PrimaryGeneratedColumn('increment')
	id: number;
	
	@CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
	
	@OneToOne(type => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
