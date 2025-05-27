import { SocketSlot } from '../classes/Outlet';
import { insertRecord } from '../db/actions';
import { dht, outlet } from '../instances';

export function collectRecords(timestamp: number) {
	insertRecord({
		timestamp,
		temperature: dht.temperature,
		humidity: dht.humidity,
		light: outlet.isEnabled(SocketSlot.Light),
		fan: outlet.isEnabled(SocketSlot.Fan),
		humidifier: outlet.isEnabled(SocketSlot.Humidifier),
		ventilator: outlet.isEnabled(SocketSlot.Ventilator),
	});
}
