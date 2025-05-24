import { config } from '../config';
import { databaseClient } from './client';

export const LogType = {
	Info: 'INFO',
	Warning: 'WARNING',
	Error: 'ERROR',
} as const;

type LogTypeValue = (typeof LogType)[keyof typeof LogType];

export function log(message: string, type: LogTypeValue = LogType.Info) {
	const timestamp = Date.now();
	console.log(`[${new Date().toLocaleString('cs')}] ${type}: ${message}`);
	if (config.database.loggingEnabled) {
		databaseClient.prepare('INSERT INTO logs (timestamp, type, log) VALUES (?, ?, ?)').run(timestamp, type, message);
	}
}
