import { Model } from 'objection';
import { Class } from './Class';

export class ClassSchedule extends Model {
	static get tableName() {
		return 'class_schedule'
	}

	static get relationMappings() {
		return {
			classes: {
				relation: Model.BelongsToOneRelation,
				modelClass: Class,
				join: {
					from: 'class_schedule.class_id',
					to: 'classes.id'
				}
			}
		}
	}
}