import { databaseClient } from '../instances';
import type { DatabaseLog, DatabaseRecord } from './types';

export function getRecords(from?: number, to?: number): Array<DatabaseRecord> {
	const where: Array<string> = [];
	if (from) {
		where.push(`timestamp >= ${from}`);
	}
	if (to) {
		where.push(`timestamp <= ${to}`);
	}
	return databaseClient
		.prepare(`SELECT * FROM records ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY timestamp ASC`)
		.all() as Array<DatabaseRecord>;
}

export function insertRecord(record: DatabaseRecord): void {
	databaseClient
		.prepare(
			'INSERT INTO records (timestamp, temperature, humidity, light, fan, humidifier, ventilator) VALUES (?, ?, ?, ?, ?, ?, ?)',
		)
		.run(
			record.timestamp,
			record.temperature,
			record.humidity,
			record.light ? 1 : 0,
			record.fan ? 1 : 0,
			record.humidifier ? 1 : 0,
			record.ventilator ? 1 : 0,
		);
}

export function getLogs(limit = 50, page = 0): Array<DatabaseLog> {
	const offset = page * limit;
	return databaseClient
		.prepare(`SELECT * FROM logs ORDER BY timestamp DESC LIMIT ${limit} OFFSET ${offset}`)
		.all() as Array<DatabaseLog>;
}

export function insertLog(log: DatabaseLog) {
	databaseClient
		.prepare('INSERT INTO logs (timestamp, type, message) VALUES (?, ?, ?)')
		.run(log.timestamp, log.type, log.message);
}

export function deleteRecordsOlderThan(timestamp: number): void {
	databaseClient.prepare('DELETE FROM records WHERE timestamp < ?').run(timestamp);
}

export function deleteLogsOlderThan(timestamp: number): void {
	databaseClient.prepare('DELETE FROM logs WHERE timestamp < ?').run(timestamp);
}
