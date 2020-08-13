import { Model } from 'objection';
import { Connection } from './Connection'
import { Class } from './Class';

export class User extends Model {
	static get tableName() {
		return 'users'
	}

	static get relationMappings() {
		return {
			connections: {
				relation: Model.HasManyRelation,
				modelClass: Connection,
				join: {
					from: 'users.id',
					to: 'connections.user_id'
				}
			},

			class: {
				relation: Model.HasOneRelation,
				modelClass: Class,
				join: {
					from: 'users.id',
					to: 'classes.user_id'
				}
			}
		}
	}
	
	$parseDatabaseJson(json: {
		id?: string;
		email?: string;
		password?: string;
		token?: string;
	}) {
		json = super.$parseDatabaseJson(json);
		delete json.id;
		delete json.email;
		delete json.password;
		delete json.token

    return json;
  }
}