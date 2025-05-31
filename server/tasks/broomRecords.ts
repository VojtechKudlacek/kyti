import { startOfHour, subDays } from 'date-fns';
import { dbConfigVariable } from '../classes/ConfigManager';
import { deleteLogsOlderThan, deleteRecordsOlderThan } from '../db/actions';
import { configManager } from '../instances';

export function broomRecords() {
	if (!configManager.getValue(dbConfigVariable.taskLogBroom)) {
		return;
	}

	const startOfThisHour = startOfHour(new Date());
	const oneDayAgo = subDays(startOfThisHour, 1);

	deleteRecordsOlderThan(oneDayAgo.getTime());
	deleteLogsOlderThan(oneDayAgo.getTime());
}
