import * as Knex from "knex";
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
			{
				first_name: 'Adelso',
				last_name: 'Juniores',
				email: 'adelso@gmail.com',
				password: await bcrypt.hash('adelso123', 10)
			},
			{
				first_name: 'Sarah',
				last_name: 'Kerrigan',
				email: 's-kerry@gmail.com',
				password: await bcrypt.hash('raynorS2', 10)
			},
			{
				first_name: 'John',
				last_name: 'Doe',
				email: 'john@doe.com',
				password: await bcrypt.hash('johnd0e', 10)
			},
			{
				first_name: 'Carolina',
				last_name: 'Nogueira',
				email: 'carol@gmail.com',
				password: await bcrypt.hash('c4r0l22', 10)
			},
			{
				first_name: 'Francisco',
				last_name: 'Lima',
				email: 'lima_chico@gmail.com',
				password: await bcrypt.hash('ch1quin234', 10)
			},
			{
				first_name: 'Letícia',
				last_name: 'Galvão',
				email: 'le_galvao@gmail.com',
				password: await bcrypt.hash('lele232', 10)
			},
			{
				first_name: 'Thamires',
				last_name: 'Souza',
				email: 'sou_thamy@gmail.com',
				password: await bcrypt.hash('th4m1z0n4@32', 10)
			},
			{
				first_name: 'Carlos',
				last_name: 'Silva',
				email: 'carlinhos_auau@gmail.com',
				password: await bcrypt.hash('carlotaPIK25', 10)
			},
    ]);
};
