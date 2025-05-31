import { insertRecord } from '../db/actions';
import type { DatabaseRecord } from '../db/types';
import { climateObserver, outlet, socketManager } from '../instances';

export function collectRecords(timestamp: number) {
	const climateData = climateObserver.getCurrentClimateData();

	const newRecord: DatabaseRecord = {
		timestamp,
		temperature: climateData.temperature,
		humidity: climateData.humidity,
		light: outlet.isEnabled(outlet.slot.Light),
		fan: outlet.isEnabled(outlet.slot.Fan),
		humidifier: outlet.isEnabled(outlet.slot.Humidifier),
		ventilator: outlet.isEnabled(outlet.slot.Ventilator),
	};

	insertRecord(newRecord);
	socketManager.emitNewRecord(newRecord);
}
