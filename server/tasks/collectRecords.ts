import { dbConfigVariable } from '../classes/ConfigManager';
import { recordSchema } from '../db/schema';
import type { RecordEntity } from '../db/types';
import { climateObserver, configManager, databaseClient, outlet, socketManager } from '../instances';

export function collectRecords(timestamp: number) {
	const isEnabled = configManager.getValue(dbConfigVariable.taskClimateLog);
	if (!isEnabled) {
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

	databaseClient.db.insert(recordSchema).values(newRecord).run();
	socketManager.emitNewRecord(newRecord);
}
