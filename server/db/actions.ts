import { databaseClient } from './client';
import type { DatabaseRecord, WritableDatabseRecord } from './types';

export function getRecords(): Array<DatabaseRecord> {
	return databaseClient
		.prepare('SELECT * FROM records ORDER BY timestamp DESC LIMIT 60')
		.all() as Array<DatabaseRecord>;
}

export function insertRecord(record: WritableDatabseRecord) {
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
