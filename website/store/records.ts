import { getRecordsRequest } from 'api/calls';
import { subMinutes } from 'date-fns';
import { atom } from 'jotai';
import type { ApiRecord } from 'types';

export const minutesToRenderAtom = atom(30);

export const recordsAtom = atom<Array<ApiRecord>>([]);

export const average30RecordsAtom = atom<Array<ApiRecord>>(function (get) {
	const records = get(recordsAtom);
	if (records.length <= 30) {
		return records;
	}

	const recordsToSquash = records.length / 30;
	const result: Array<ApiRecord> = [];
	for (let i = 0; i < 30; i++) {
		const baseOffset = i * recordsToSquash;
		const chunk = records.slice(baseOffset, baseOffset + recordsToSquash);
		const chunkResult: ApiRecord = {
			timestamp: (chunk[0].timestamp + chunk[chunk.length - 1].timestamp) / 2,
			humidity: null,
			temperature: null,
			light: false,
			ventilator: false,
			fan: false,
			humidifier: false,
		};
		for (const record of chunk) {
			if (record.humidity !== null) {
				chunkResult.humidity = (chunkResult.humidity ?? 0) + record.humidity;
			}
			if (record.temperature !== null) {
				chunkResult.temperature = (chunkResult.temperature ?? 0) + record.temperature;
			}
			chunkResult.light = chunkResult.light || record.light;
			chunkResult.ventilator = chunkResult.ventilator || record.ventilator;
			chunkResult.fan = chunkResult.fan || record.fan;
			chunkResult.humidifier = chunkResult.humidifier || record.humidifier;
		}
		if (chunkResult.humidity !== null) {
			chunkResult.humidity = Math.round((chunkResult.humidity / chunk.length) * 10) / 10;
		}
		if (chunkResult.temperature !== null) {
			chunkResult.temperature = Math.round((chunkResult.temperature / chunk.length) * 10) / 10;
		}
		result.push(chunkResult);
	}
	return result;
});

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
