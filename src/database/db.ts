import knex from 'knex';
import { Model } from 'objection';
import dotenv from 'dotenv';
dotenv.config();

const configs = require('../../knexfile');

const environment = process.env.NODE_ENV as string;

const db = knex(configs[environment]);
Model.knex(db);

export default db;