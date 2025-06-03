import { dbConfigVariable } from '../classes/ConfigManager';
import { insertRecord } from '../db/actions';
import type { RecordEntity } from '../db/types';
import { climateObserver, configManager, outlet, socketManager } from '../instances';

export function collectRecords(timestamp: number) {
	if (!configManager.getValue(dbConfigVariable.taskClimateLog)) {
		return;
	}

	const climateData = climateObserver.getCurrentClimateData();

	const newRecord: RecordEntity = {
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
