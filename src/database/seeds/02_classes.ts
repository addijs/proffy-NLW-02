import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Class } from '../entities/Class';
import { User } from '../entities/User';

export default class CreateClasses implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
		const user = new User();
		
		for (let i = 1; i <= 4; i++) {
			user.id = i;
			await factory(Class)().create({ user });
		}
  }
}