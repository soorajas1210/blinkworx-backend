import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool, Client } = pg;
const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } = process.env;

const client = new Client({
  user: DB_USER,
  host: DB_HOST,
  database: "postgres", // check/create database
  password: DB_PASSWORD,
  port: DB_PORT,
  // ssl: {
  //   rejectUnauthorized: false, // Required for Aiven SSL connections
  // },
});

async function createDatabaseIfNotExists() {
  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    if (res.rowCount === 0) {
      console.log(`Database "${DB_NAME}" does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Database "${DB_NAME}" created successfully.`);
    } else {
      console.log(`Database "${DB_NAME}" already exists.`);
    }
  } catch (err) {
    console.error("Error checking/creating database:", err);
  } finally {
    await client.end();
  }
}

// await createDatabaseIfNotExists();

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  // ssl: {
  //   rejectUnauthorized: false, // Required for Aiven SSL connections
  // },
});

export default pool;
