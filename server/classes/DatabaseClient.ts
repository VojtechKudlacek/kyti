import assert from 'node:assert/strict';
import Database from 'better-sqlite3';

type DatabaseType = ReturnType<typeof Database>;

export class DatabaseClient {
	private database: DatabaseType | null = null;

	public initialize(name: string) {
		this.database = new Database(name);
	}

	public get db(): DatabaseType {
		assert(this.database, 'Database not initialized');
		return this.database;
	}
}
