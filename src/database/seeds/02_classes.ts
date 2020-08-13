import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("classes").del();

    // Inserts seed entries
    await knex("classes").insert([
			{
				user_id: 1,
				subject: "Programação",
				cost: 100,
			},
			{
				user_id: 2,
				subject: "Biologia",
				cost: 40,
			},
			{
				user_id: 3,
				subject: "Matemática",
				cost: 50,
			},
			{
				user_id: 4,
				subject: "Física",
				cost: 70,
			},
			{
				user_id: 5,
				subject: "Português",
				cost: 120,
			},
			{
				user_id: 6,
				subject: "Química",
				cost: 40,
			}
    ]);
};
