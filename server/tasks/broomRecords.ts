import { subHours } from 'date-fns';
import { dbConfigVariable } from '../classes/ConfigManager';
import { deleteLogsOlderThan, deleteRecordsOlderThan } from '../db/actions';
import { configManager } from '../instances';

export function broomRecords() {
	const isEnabled = configManager.getValue(dbConfigVariable.taskLogBroom);
	if (!isEnabled) {
		return;
	}

	const recordLifespan = configManager.getValue(dbConfigVariable.recordLifespan);
	const logLifespan = configManager.getValue(dbConfigVariable.logLifespan);

	const recordsToDeleteTimestamp = subHours(new Date(), recordLifespan).getTime();
	const logsToDeleteTimestamp = subHours(new Date(), logLifespan).getTime();

	deleteRecordsOlderThan(recordsToDeleteTimestamp);
	deleteLogsOlderThan(logsToDeleteTimestamp);
}
