import { databaseClient } from '../instances';
import type { ConfigEntity, LogEntity, RecordEntity } from './types';

export function getConfig(): Array<ConfigEntity> {
	return databaseClient.db.prepare<[], ConfigEntity>('SELECT * FROM config').all();
}

export function updateConfig(key: string, value: string): void {
	databaseClient.db.prepare<[string, string], void>('UPDATE config SET value = ? WHERE key = ?').run(value, key);
}

export function getRecords(from?: number, to?: number): Array<RecordEntity> {
	const where: Array<string> = [];
	if (from) {
		where.push(`timestamp >= ${from}`);
	}
	if (to) {
		where.push(`timestamp <= ${to}`);
	}
	return databaseClient.db
		.prepare<[], RecordEntity>(
			`SELECT * FROM records ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY timestamp ASC`,
		)
		.all()
		.map((record) => ({
			...record,
			light: Boolean(record.light),
			fan: Boolean(record.fan),
			humidifier: Boolean(record.humidifier),
			ventilator: Boolean(record.ventilator),
		}));
}

export function insertRecord(record: RecordEntity): void {
	databaseClient.db
		.prepare<[number, number | null, number | null, number, number, number, number], void>(
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

export function getLogs(limit = 50, offset = 0): Array<LogEntity> {
	return databaseClient.db
		.prepare<[], LogEntity>(`SELECT * FROM logs ORDER BY timestamp DESC LIMIT ${limit} OFFSET ${offset}`)
		.all();
}

export function insertLog(log: LogEntity) {
	databaseClient.db
		.prepare<[number, string, string], void>('INSERT INTO logs (timestamp, type, message) VALUES (?, ?, ?)')
		.run(log.timestamp, log.type, log.message);
}

export function deleteRecordsOlderThan(timestamp: number): void {
	databaseClient.db.prepare<[number], void>('DELETE FROM records WHERE timestamp < ?').run(timestamp);
}

export function deleteLogsOlderThan(timestamp: number): void {
	databaseClient.db.prepare<[number], void>('DELETE FROM logs WHERE timestamp < ?').run(timestamp);
}
