import assert from 'node:assert/strict';
import Database from 'better-sqlite3';
import { type BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';

type DatabaseType = ReturnType<typeof Database>;

export class DatabaseClient {
	private database: DatabaseType | null = null;
	private drizzleClient: BetterSQLite3Database | null = null;

	public initialize(name: string) {
		this.database = new Database(name);
		this.drizzleClient = drizzle(this.database);
	}

	public get db(): BetterSQLite3Database {
		assert(this.drizzleClient, 'Database not initialized');
		return this.drizzleClient;
	}

	public close() {
		if (this.database) {
			this.database.close();
			this.database = null;
			this.drizzleClient = null;
		}
	}
}
