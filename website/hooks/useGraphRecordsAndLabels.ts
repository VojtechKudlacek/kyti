import { endOfMinute, format, subMinutes } from 'date-fns';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { minutesToRenderAtom, recordsAtom, recordsToRenderAtom } from 'store/records';
import type { ApiRecord } from 'types';

function toFixed1(value: number): number {
	return Math.round(value * 10) / 10;
}

export function useGraphRecordsAndLabels(): [Array<ApiRecord>, Array<string>] {
	const records = useAtomValue(recordsAtom);
	const recordsToRender = useAtomValue(recordsToRenderAtom);
	const minutesToRender = useAtomValue(minutesToRenderAtom);

	return useMemo(() => {
		const endOfCurrentMinute = endOfMinute(Date.now());
		const minutesPerRecord = minutesToRender / recordsToRender;
		const recordsResult: Array<ApiRecord> = [];
		const timestampsToRender: Array<number> = [];

		for (let i = 0; i < recordsToRender; i++) {
			const timestamp = subMinutes(endOfCurrentMinute, i * minutesPerRecord).getTime();
			timestampsToRender.unshift(timestamp);
		}

		for (let i = 0; i < timestampsToRender.length; i++) {
			const previousTimestamp = timestampsToRender[i - 1] ?? 0;
			const timestamp = timestampsToRender[i];
			const recordsForTimestamp = records.filter(
				(record) => record.timestamp > previousTimestamp && record.timestamp <= timestamp,
			);

			const temperatureData: Array<number> = [];
			const humidityData: Array<number> = [];
			const lightData: Array<number> = [];
			const ventilatorData: Array<number> = [];
			const fanData: Array<number> = [];
			const humidifierData: Array<number> = [];

			for (const record of recordsForTimestamp) {
				if (record.temperature !== null) {
					temperatureData.push(record.temperature);
				}
				if (record.humidity !== null) {
					humidityData.push(record.humidity);
				}
				lightData.push(record.light ? 1 : 0);
				ventilatorData.push(record.ventilator ? 1 : 0);
				fanData.push(record.fan ? 1 : 0);
				humidifierData.push(record.humidifier ? 1 : 0);
			}

			const temperatureResult =
				temperatureData.length > 0
					? toFixed1(temperatureData.reduce((a, b) => a + b, 0) / temperatureData.length)
					: null;
			const humidityResult =
				humidityData.length > 0 ? toFixed1(humidityData.reduce((a, b) => a + b, 0) / humidityData.length) : null;
			const lightResult = lightData.reduce((a, b) => a + b, 0) / lightData.length >= 0.5;
			const ventilatorResult = ventilatorData.reduce((a, b) => a + b, 0) / ventilatorData.length >= 0.5;
			const fanResult = fanData.reduce((a, b) => a + b, 0) / fanData.length >= 0.5;
			const humidifierResult = humidifierData.reduce((a, b) => a + b, 0) / humidifierData.length >= 0.5;

			recordsResult.push({
				timestamp,
				temperature: temperatureResult,
				humidity: humidityResult,
				light: lightResult,
				fan: fanResult,
				humidifier: humidifierResult,
				ventilator: ventilatorResult,
			});
		}

		const labels = timestampsToRender.map((timestamp) => format(timestamp, 'HH:mm'));

		return [recordsResult, labels];
	}, [records, recordsToRender, minutesToRender]);
}
