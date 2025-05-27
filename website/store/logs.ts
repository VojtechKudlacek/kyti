import { getLogsRequest } from 'api/calls';
import { atom } from 'jotai';
import type { ApiLog } from 'types';

export const logsAtom = atom<Array<ApiLog>>([]);

export const fetchLogsAtom = atom(null, async (_get, set) => {
	const logs = await getLogsRequest();
	set(logsAtom, logs);
});

export const addLogAtom = atom(null, (get, set, log: ApiLog) => {
	const logs = get(logsAtom);
	set(logsAtom, [...logs, log]);
});
