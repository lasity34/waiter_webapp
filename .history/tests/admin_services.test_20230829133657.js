import assert from "assert";
import pgPromise from "pg-promise";
import dotenv from "dotenv";

import registration_service from "../services/registration_service.js";

dotenv.config();

const connectionOptions = {
  connectionString: process.env.DATABASE_URL_TEST,
  ssl: { rejectUnauthorized: false },
};

const pgp = pgPromise();

const db = pgp(connectionOptions);