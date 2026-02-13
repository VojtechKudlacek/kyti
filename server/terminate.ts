import { LogType } from './classes/Logger';
import { databaseClient, fastify, logger, taskScheduler } from './instances';

let isTerminating = false;

export function terminate(reason: string, exitCode = 0) {
	if (isTerminating) {
		return;
	}
	isTerminating = true;
	logger.log(`Terminating process: ${reason}`, exitCode === 0 ? LogType.Info : LogType.Error);
	taskScheduler.stop();
	databaseClient.close();
	fastify.close();
	// Give a small grace period for cleanup operations
	setTimeout(() => process.exit(exitCode), 100);
}
