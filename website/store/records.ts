import { getRecordsRequest } from 'api/calls';
import { subMinutes } from 'date-fns';
import { atom } from 'jotai';
import type { ApiRecord } from 'types';

export const recordsToRenderAtom = atom(window.innerWidth > 768 ? 30 : 15);

export const minutesToRenderAtom = atom(30);

export const recordsAtom = atom<Array<ApiRecord>>([]);

export const lastRecordAtom = atom<ApiRecord | null>(function (get) {
	const records = get(recordsAtom);
	return records[records.length - 1] ?? null;
});

export const fetchRecordsAtom = atom(null, async (get, set) => {
	const to = Date.now();
	const from = subMinutes(to, get(minutesToRenderAtom)).getTime();
	const records = await getRecordsRequest(from, to);
	set(recordsAtom, records);
});

export const addRecordAtom = atom(null, (get, set, record: ApiRecord) => {
	const records = [...get(recordsAtom), record];
	const minutesToRender = get(minutesToRenderAtom);
	const from = subMinutes(Date.now(), minutesToRender).getTime();
	set(
		recordsAtom,
		records.filter((record) => record.timestamp >= from),
	);
});
