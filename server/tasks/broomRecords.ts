import { startOfHour, subDays } from 'date-fns';
import { deleteLogsOlderThan, deleteRecordsOlderThan } from '../db/actions';

export function broomRecords() {
	const startOfThisHour = startOfHour(new Date());
	const oneDayAgo = subDays(startOfThisHour, 1);

	deleteRecordsOlderThan(oneDayAgo.getTime());
	deleteLogsOlderThan(oneDayAgo.getTime());
}
