import { SocketSlot } from '../classes/Outlet';
import { config } from '../config';
import { log } from '../db/log';
import { climateObserver, outlet } from '../instances';

export async function controlClimate() {
	await outlet.fetchState();
	const climateData = climateObserver.getCurrentClimateData();
	if (climateData.temperature === null || climateData.humidity === null) {
		return;
	}

	const ventilatorIsOn = outlet.isEnabled(SocketSlot.Ventilator);
	let newVentilatorState = ventilatorIsOn;
	// Turn ventilator on if temperature is too high
	if (climateData.temperature > config.tent.temperatureMax) {
		newVentilatorState = true;
	}
	// Turn ventilator off if it's on and temperature is within range
	if (climateData.temperature < config.tent.temperatureMin + config.tent.temperatureRange) {
		newVentilatorState = false;
	}
	// Turn ventilator on if humidity is too high, but only if temperature is within range
	if (
		climateData.humidity > config.tent.humidityMax &&
		climateData.temperature > config.tent.temperatureMin + config.tent.temperatureRange
	) {
		newVentilatorState = true;
	}

	const humidifierIsOn = outlet.isEnabled(SocketSlot.Humidifier);
	let newHumidifierState = humidifierIsOn;
	// Turn humidifier on if humidity is too low
	if (climateData.humidity < config.tent.humidityMin) {
		newHumidifierState = true;
	}
	// Turn humidifier off if it's on and humidity is within range
	if (climateData.humidity > config.tent.humidityMin + config.tent.humidityRange) {
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
