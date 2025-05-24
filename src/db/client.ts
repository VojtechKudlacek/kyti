import Database from 'better-sqlite3';
import { config } from '../config';

export const databaseClient = new Database(config.database.name);
