import { Model } from 'objection';
import { User } from './User';

export class Connection extends Model {
	static get tableName() {
		return 'connections'
	}

	static get relationMappings() {
		return {
			user: {
				relation: Model.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: 'connections.user_id',
					to: 'user.id'
				}
			}
		}
	}
}