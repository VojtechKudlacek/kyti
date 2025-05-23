import { databaseClient } from './client';

export enum LogType {
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR',
}

export function log(type: LogType, message: string) {
	const timestamp = Date.now();
	databaseClient.prepare('INSERT INTO logs (timestamp, type, log) VALUES (?, ?, ?)').run(timestamp, type, message);
}
