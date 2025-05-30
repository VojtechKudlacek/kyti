import { SocketSlot } from '../classes/Outlet';
import { insertRecord } from '../db/actions';
import type { DatabaseRecord } from '../db/types';
import { climateObserver, outlet, socketManager } from '../instances';

export function collectRecords(timestamp: number) {
	const climateData = climateObserver.getCurrentClimateData();

	const newRecord: DatabaseRecord = {
		timestamp,
		temperature: climateData.temperature,
		humidity: climateData.humidity,
		light: outlet.isEnabled(SocketSlot.Light),
		fan: outlet.isEnabled(SocketSlot.Fan),
		humidifier: outlet.isEnabled(SocketSlot.Humidifier),
		ventilator: outlet.isEnabled(SocketSlot.Ventilator),
	};
	insertRecord(newRecord);
	socketManager.emitNewRecord(newRecord);
}
