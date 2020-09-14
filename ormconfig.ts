import path from 'path';

module.exports = [
	{
		name: "test",
		type: "sqlite",
		database: path.resolve(__dirname, '__tests__', 'test.sqlite'),
		entities: [path.resolve(__dirname, 'src', 'database', 'entities/*{.ts, .js}')],
		migrations: [path.resolve(__dirname, 'src', 'database', 'migrations/*{.ts, .js}')],
		seeds: [path.resolve(__dirname, 'src', 'database', 'seeds/*{.ts, .js}')],
		factories: [path.resolve(__dirname, 'src', 'database', 'factories/*{.ts, .js}')],
		// migrationsRun: true,
		// dropSchema: true,
		cli: {
			entitiesDir: 'src/database/entities',
			migrationsDir: 'src/database/migrations'
		}
	},
	{
		name: "development",
		type: "sqlite",
		database: "src/database/database.sqlite",
		entities: [path.resolve(__dirname, 'src', 'database', 'entities/*{.ts, .js}')],
		migrations: [path.resolve(__dirname, 'src', 'database', 'migrations/*{.ts, .js}')],
		seeds: [path.resolve(__dirname, 'src', 'database', 'seeds/*{.ts, .js}')],
		factories: [path.resolve(__dirname, 'src', 'database', 'factories/*{.ts, .js}')],
		cli: {
			entitiesDir: 'src/database/entities',
			migrationsDir: 'src/database/migrations'
		}
	}
]