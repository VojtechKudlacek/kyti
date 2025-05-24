import { databaseClient } from './client';
import type { WritableRecord } from './types';

export function insertRecord(record: WritableRecord) {
	databaseClient
		.prepare(
			'INSERT INTO records (timestamp, temperature, humidity, light, fan, humidifier, ventilator) VALUES (?, ?, ?, ?, ?, ?, ?)',
		)
		.run(
			Date.now(),
			record.temperature,
			record.humidity,
			record.light ? 1 : 0,
			record.fan ? 1 : 0,
			record.humidifier ? 1 : 0,
			record.ventilator ? 1 : 0,
		);
}
