import { SocketSlot } from '../classes/Outlet';
import { insertRecord } from '../db/actions';
import type { DatabaseRecord } from '../db/types';
import { dht, outlet, socketManager } from '../instances';

export function collectRecords(timestamp: number) {
	const newRecord: DatabaseRecord = {
		timestamp,
		temperature: dht.temperature,
		humidity: dht.humidity,
		light: outlet.isEnabled(SocketSlot.Light),
		fan: outlet.isEnabled(SocketSlot.Fan),
		humidifier: outlet.isEnabled(SocketSlot.Humidifier),
		ventilator: outlet.isEnabled(SocketSlot.Ventilator),
	};
	insertRecord(newRecord);
	socketManager.emitNewRecord(newRecord);
}
