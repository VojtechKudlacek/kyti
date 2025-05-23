import { databaseClient } from './client';

export function setupDatabase(): void {
	// Table to store sensor readings and device states
	databaseClient.exec(`
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp INTEGER NOT NULL,
      temperature REAL NOT NULL,
      humidity REAL NOT NULL,
      light BOOLEAN NOT NULL,
      fan BOOLEAN NOT NULL,
      humidifier BOOLEAN NOT NULL,
      ventilator BOOLEAN NOT NULL
    )
  `);

	// Table to store generic config key-value pairs
	databaseClient.exec(`
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

	// Table to store timestamped log messages
	databaseClient.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp INTEGER NOT NULL,
      type TEXT NOT NULL,
      log TEXT NOT NULL
    )
  `);
}
