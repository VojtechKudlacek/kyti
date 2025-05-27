import { config } from '../config';
import { socketManager } from '../instances';
import { insertLog } from './actions';
import type { DatabaseLog } from './types';

export const LogType = {
	Info: 'INFO',
	Warning: 'WARNING',
	Error: 'ERROR',
} as const;

type LogTypeValue = (typeof LogType)[keyof typeof LogType];

export function log(message: string, type: LogTypeValue = LogType.Info) {
	console.log(`[${new Date().toLocaleString('cs')}] ${type}: ${message}`);
	if (config.database.loggingEnabled) {
		const newLog: DatabaseLog = { timestamp: Date.now(), type, message };
		socketManager.emitNewLog(newLog);
		insertLog(newLog);
	}
}
