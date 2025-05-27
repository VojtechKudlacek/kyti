import { getRecordsRequest } from 'api/calls';
import { subMinutes } from 'date-fns';
import { atom } from 'jotai';
import type { ApiRecord } from 'types';

const maxRecords = 60;

export const recordsAtom = atom<Array<ApiRecord>>([]);

export const fetchRecordsAtom = atom(null, async (_get, set) => {
	const to = Date.now();
	const from = subMinutes(to, maxRecords).getTime();
	const records = await getRecordsRequest(from, to);
	set(recordsAtom, records);
});

export const addRecordAtom = atom(null, (get, set, record: ApiRecord) => {
	const records = get(recordsAtom);
	set(recordsAtom, [...records, record].slice(-maxRecords));
});
