import knex from 'knex';

const configs = require('../../knexfile');

const db = knex(configs.development);

export default db;