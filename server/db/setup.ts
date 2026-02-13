import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { dbConfigVariables, defaultDbConfigValues } from '../classes/ConfigManager';
import { databaseClient } from '../instances';
import { configSchema } from './schema';

export function setupDatabase(): void {
	// Run migrations
	migrate(databaseClient.db, { migrationsFolder: 'server/db/migrations' });

	// Insert ConfigManager.Variables into config table if they don't exist
	const valuesToInsert = dbConfigVariables.map((variable) => ({
		key: variable,
		value: JSON.stringify(defaultDbConfigValues[variable]),
	}));

	if (valuesToInsert.length > 0) {
		databaseClient.db.insert(configSchema).values(valuesToInsert).onConflictDoNothing().run();
	}
}
