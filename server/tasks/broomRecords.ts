import { subHours } from 'date-fns';
import { dbConfigVariable } from '../classes/ConfigManager';
import { deleteLogsOlderThan, deleteRecordsOlderThan } from '../db/actions';
import { LogType, log } from '../db/log';
import { configManager, socketManager } from '../instances';

export function broomRecords() {
	const isEnabled = configManager.getValue(dbConfigVariable.taskLogBroom);
	if (!isEnabled) {
		return;
	}

	const recordLifespan = configManager.getValue(dbConfigVariable.recordLifespan);
	const logLifespan = configManager.getValue(dbConfigVariable.logLifespan);

	const recordsToDeleteTimestamp = subHours(new Date(), recordLifespan).getTime();
	const logsToDeleteTimestamp = subHours(new Date(), logLifespan).getTime();

	const recordsDeleted = deleteRecordsOlderThan(recordsToDeleteTimestamp);
	const logsDeleted = deleteLogsOlderThan(logsToDeleteTimestamp);

	if (recordsDeleted > 0) {
		log(`Deleted ${recordsDeleted} records`, LogType.Info, false);
	}

	if (logsDeleted > 0) {
		log(`Deleted ${logsDeleted} logs`, LogType.Info, false);
		socketManager.emitLogsChange();
	}
}
