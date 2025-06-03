import { socketManager } from '../instances';
import { insertLog } from './actions';
import type { LogEntity } from './types';

export const LogType = {
	Info: 'INFO',
	Warning: 'WARNING',
	Error: 'ERROR',
} as const;

type LogTypeValue = (typeof LogType)[keyof typeof LogType];

export function log(message: string, type: LogTypeValue = LogType.Info, insertToDb = true) {
	console.log(`[${new Date().toLocaleString('cs')}] ${type}: ${message}`);
	if (insertToDb) {
		const newLog: LogEntity = { timestamp: Date.now(), type, message };
		insertLog(newLog);
		socketManager.emitNewLog(newLog);
	}
}
