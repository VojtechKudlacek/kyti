import { type SQL, and, asc, desc, eq, gte, lt, lte } from 'drizzle-orm';
import { databaseClient } from '../instances';
import { configSchema, logSchema, recordSchema } from './schema';
import type { ConfigEntity, LogEntity, RecordEntity } from './types';

export function getConfig(): Array<ConfigEntity> {
	return databaseClient.db.select().from(configSchema).all();
}

export function updateConfig(key: string, value: string): void {
	databaseClient.db.update(configSchema).set({ value }).where(eq(configSchema.key, key)).run();
}

export function getRecords(from?: number, to?: number): Array<RecordEntity> {
	const conditions: Array<SQL> = [];
	if (from) {
		conditions.push(gte(recordSchema.timestamp, from));
	}
	if (to) {
		conditions.push(lte(recordSchema.timestamp, to));
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	return databaseClient.db.select().from(recordSchema).where(whereClause).orderBy(asc(recordSchema.timestamp)).all();
}

export function insertRecord(record: RecordEntity): void {
	databaseClient.db.insert(recordSchema).values(record).run();
}

export function getLogs(): Array<LogEntity> {
	return databaseClient.db.select().from(logSchema).orderBy(desc(logSchema.timestamp)).all();
}

export function insertLog(log: LogEntity) {
	databaseClient.db.insert(logSchema).values(log).run();
}

export function deleteRecordsOlderThan(timestamp: number): number {
	const result = databaseClient.db.delete(recordSchema).where(lt(recordSchema.timestamp, timestamp)).run();
	return result.changes;
}

export function deleteLogsOlderThan(timestamp: number): number {
	const result = databaseClient.db.delete(logSchema).where(lt(logSchema.timestamp, timestamp)).run();
	return result.changes;
}
