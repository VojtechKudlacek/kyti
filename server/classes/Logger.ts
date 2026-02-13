import { logSchema } from '../db/schema';
import type { LogEntity } from '../db/types';
import type { DatabaseClient } from './DatabaseClient';
import type { SocketManager } from './SocketManager';

export const LogType = {
	Debug: 'DEBUG',
	Info: 'INFO',
	Warning: 'WARNING',
	Error: 'ERROR',
} as const;

type LogTypeValue = (typeof LogType)[keyof typeof LogType];

export class Logger {
	private readonly databaseClient: DatabaseClient;
	private readonly socketManager: SocketManager;

	constructor(databaseClient: DatabaseClient, socketManager: SocketManager) {
		this.databaseClient = databaseClient;
		this.socketManager = socketManager;
	}

	public log(message: string, type: LogTypeValue = LogType.Info) {
		console.log(`[${new Date().toLocaleString('cs')}] ${type}: ${message}`);
		if (type !== LogType.Debug) {
			const newLog: LogEntity = { timestamp: Date.now(), type, message };
			this.databaseClient.db.insert(logSchema).values(newLog).run();
			this.socketManager.emitNewLog(newLog);
		}
	}
}
