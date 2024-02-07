import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config()

const Pool = pg.Pool;
const env = process.env;

export const pool = new Pool({
    user:       env.POSTGRES_USER,
    password:   env.POSTGRES_PASSWORD,
    host:       env.POSTGRES_HOST,
    port:       +(env.POSTGRES_PORT || 5432),
    database:   env.POSTGRES_DATABASE
});
