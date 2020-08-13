import path from 'path';
import dotenv from 'dotenv';
dotenv.config()

module.exports = {
	test: {
		client: 'sqlite3',
		connection: {
			filename: path.resolve(__dirname, '__tests__', 'tests.sqlite')
		},
		migrations: {
			directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
			extension: 'ts'
		},
		seeds: {
			directory: path.resolve(__dirname, 'src', 'database', 'seeds')
		},

		useNullAsDefault: true
	},

	development: {
		client: 'sqlite3',
		connection: {
			filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite')
		},
		migrations: {
			directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
			extension: 'ts'
		},
		seeds: {
			directory: path.resolve(__dirname, 'src', 'database', 'seeds')
		},

		useNullAsDefault: true
	},

	production: {
    client: 'pg',
    connection: {
			host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
		migrations: {
			directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
			extension: 'ts'
		},
		seeds: {
			directory: path.resolve(__dirname, 'src', 'database', 'seeds')
		}
  }
}