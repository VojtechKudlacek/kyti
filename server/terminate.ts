import { LogType, log } from './db/log';
import { databaseClient, fastify, scheduler } from './instances';

let isTerminating = false;

export function terminate(reason: string, exitCode = 0) {
	if (isTerminating) {
		return;
	}
	isTerminating = true;
	log(`Terminating process: ${reason}`, exitCode === 0 ? LogType.Info : LogType.Error);
	scheduler.stop();
	databaseClient.close();
	fastify.close();
	// Give a small grace period for cleanup operations
	setTimeout(() => process.exit(exitCode), 100);
}
