import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../entities/User';
import { Credentials } from '../entities/Credentials';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Credentials)().map(async (credentials: Credentials) => {
			const insertedUser = await factory(User)().create();

			credentials.user = insertedUser;

			return credentials;
		}).createMany(5);
  }
}