import { Model, JSONSchema } from 'objection';
import { User } from './User';
import { ClassSchedule } from './ClassSchedule';

export class Class extends Model {
	static get tableName() {
		return 'classes'
	}

	static get relationMappings() {
		return {
			user: {
				relation: Model.BelongsToOneRelation,
				modelClass: User,
				// filter: query => query.select(
				// 	'first_name',
				// 	'last_name',
				// 	'avatar',
				// 	'bio',
				// 	'whatsapp'
				// ),
				join: {
					from: 'classes.user_id',
					to: 'users.id'
				}
			},

			class_schedules: {
				relation: Model.HasManyRelation,
				modelClass: ClassSchedule,
				join: {
					from: 'classes.id',
					to: 'class_schedule.class_id'
				}
			}
		}
	}

	$parseDatabaseJson(json: { user_id?: string }) {
		json = super.$parseDatabaseJson(json);
		delete json.user_id;

    return json;
  }
}