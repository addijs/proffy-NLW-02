import Faker from 'faker/locale/pt_BR';
import { define } from 'typeorm-seeding';
import { User } from '../entities/User'
import { Credentials } from '../entities/Credentials';

define(User, (faker: typeof Faker) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
	const lastName = faker.name.lastName(gender);

	
  const user = new User();
	user.first_name = firstName;
	user.last_name = lastName;
	
  return user;
});

define(Credentials, (faker: typeof Faker) => {
	const email = faker.internet.email();
	const password = faker.internet.password(6);

	const credentials = new Credentials();
	credentials.email = email;
	credentials.password = password;

	return credentials;
});