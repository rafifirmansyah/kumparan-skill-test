import env from 'dotenv';
import pgPromiseLib from 'pg-promise';

env.config();

const pgp = pgPromiseLib({});

const db = pgp(`postgres://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASS)}@${process.env.DB_HOST}:5432/${process.env.DB_DATABASE}`);

export default db;