import { subHours } from 'date-fns';
import { lt } from 'drizzle-orm';
import { dbConfigVariable } from '../classes/ConfigManager';
import { LogType } from '../classes/Logger';
import { logSchema, recordSchema } from '../db/schema';
import { configManager, databaseClient, logger, socketManager } from '../instances';

export function broomRecords() {
	const isEnabled = configManager.getValue(dbConfigVariable.taskLogBroom);
	if (!isEnabled) {
		return;
	}

	const recordLifespan = configManager.getValue(dbConfigVariable.recordLifespan);
	const logLifespan = configManager.getValue(dbConfigVariable.logLifespan);

	const recordsToDeleteTimestamp = subHours(new Date(), recordLifespan).getTime();
	const logsToDeleteTimestamp = subHours(new Date(), logLifespan).getTime();

	const recordsDeleted = databaseClient.db
		.delete(recordSchema)
		.where(lt(recordSchema.timestamp, recordsToDeleteTimestamp))
		.run().changes;
	const logsDeleted = databaseClient.db
		.delete(logSchema)
		.where(lt(logSchema.timestamp, logsToDeleteTimestamp))
		.run().changes;

	if (recordsDeleted > 0) {
		logger.log(`Deleted ${recordsDeleted} records`, LogType.Debug);
	}

	if (logsDeleted > 0) {
		logger.log(`Deleted ${logsDeleted} logs`, LogType.Debug);
		socketManager.emitLogsChange();
	}
}
