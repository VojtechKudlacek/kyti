import { SocketSlot } from '../classes/Outlet';
import { config } from '../config';
import { log } from '../db/log';
import { dht, outlet } from '../instances';

export async function controlClimate() {
	await outlet.fetchState();
	await dht.read();
	if (dht.temperature === null || dht.humidity === null) {
		return;
	}

	const ventilatorIsOn = outlet.isEnabled(SocketSlot.Ventilator);
	let newVentilatorState = ventilatorIsOn;
	// Turn ventilator on if temperature is too high
	if (dht.temperature > config.tent.temperatureMax) {
		newVentilatorState = true;
	}
	// Turn ventilator off if it's on and temperature is within range
	if (dht.temperature < config.tent.temperatureMin + config.tent.temperatureRange) {
		newVentilatorState = false;
	}
	// Turn ventilator on if humidity is too high, but only if temperature is within range
	if (
		dht.humidity > config.tent.humidityMax &&
		dht.temperature > config.tent.temperatureMin + config.tent.temperatureRange
	) {
		newVentilatorState = true;
	}

	const humidifierIsOn = outlet.isEnabled(SocketSlot.Humidifier);
	let newHumidifierState = humidifierIsOn;
	// Turn humidifier on if humidity is too low
	if (dht.humidity < config.tent.humidityMin) {
		newHumidifierState = true;
	}
	// Turn humidifier off if it's on and humidity is within range
	if (dht.humidity > config.tent.humidityMin + config.tent.humidityRange) {
		newHumidifierState = false;
	}

	if (newVentilatorState !== ventilatorIsOn) {
		await outlet.setState(SocketSlot.Ventilator, newVentilatorState);
		log(`Ventilator: ${newVentilatorState ? 'on' : 'off'}`);
	}
	if (newHumidifierState !== humidifierIsOn) {
		await outlet.setState(SocketSlot.Humidifier, newHumidifierState);
		log(`Humidifier: ${newHumidifierState ? 'on' : 'off'}`);
	}
}
