import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("class_schedule").del();

    // Inserts seed entries
    await knex("class_schedule").insert(
			[
				{ class_id: 1, week_day: 1, from: 420, to: 660 },
				{ class_id: 1, week_day: 3, from: 780, to: 960 },
				{ class_id: 2, week_day: 2, from: 780, to: 840 },
				{ class_id: 2, week_day: 4, from: 480, to: 720 },
				{ class_id: 3, week_day: 3, from: 720, to: 960 },
				{ class_id: 4, week_day: 5, from: 1080, to: 1260 },
				{ class_id: 5, week_day: 1, from: 480, to: 720 },
				{ class_id: 5, week_day: 2, from: 480, to: 600 },
				{ class_id: 6, week_day: 4, from: 480, to: 720 }
			],
		);
};
