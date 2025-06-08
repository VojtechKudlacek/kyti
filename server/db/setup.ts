import { dbConfigVariables, defaultDbConfigValues } from '../classes/ConfigManager';
import { databaseClient } from '../instances';

export function setupDatabase(): void {
	// Table to store sensor readings and device states
	databaseClient.db.exec(`
    CREATE TABLE IF NOT EXISTS records (
      timestamp INTEGER PRIMARY KEY,
      temperature REAL,
      humidity REAL,
      light BOOLEAN NOT NULL,
      fan BOOLEAN NOT NULL,
      humidifier BOOLEAN NOT NULL,
      ventilator BOOLEAN NOT NULL
    )
  `);

	// Table to store timestamped log messages
	databaseClient.db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      timestamp INTEGER PRIMARY KEY,
      type TEXT NOT NULL,
      message TEXT NOT NULL
    )
  `);

	// Table to store generic config key-value pairs
	databaseClient.db.exec(`
		CREATE TABLE IF NOT EXISTS config (
			key TEXT PRIMARY KEY,
			value TEXT NOT NULL
		)
	`);

	// Insert ConfigManager.Variables into config table if they don't exist
	const stmt = databaseClient.db.prepare('INSERT OR IGNORE INTO config (key, value) VALUES (?, ?)');
	for (const variable of dbConfigVariables) {
		stmt.run(variable, JSON.stringify(defaultDbConfigValues[variable]));
	}
}
