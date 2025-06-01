import assert from 'node:assert/strict';
import { dbConfigVariable } from '../classes/ConfigManager';
import { LogType, log } from '../db/log';
import { climateObserver, configManager, outlet } from '../instances';

export async function controlClimate() {
	if (!configManager.getValue(dbConfigVariable.taskClimateControl)) {
		return;
	}

	const { temperature, humidity } = climateObserver.getCurrentClimateData();

	assert(temperature !== null, 'Temperature is outdated for climate control');
	assert(humidity !== null, 'Humidity is outdated for climate control');

	const temperatureMax = configManager.getValue(dbConfigVariable.temperatureMax);
	const temperatureMin = configManager.getValue(dbConfigVariable.temperatureMin);
	const temperatureSufficient = configManager.getValue(dbConfigVariable.temperatureSufficient);
	const humidityMax = configManager.getValue(dbConfigVariable.humidityMax);
	const humidityMin = configManager.getValue(dbConfigVariable.humidityMin);
	const humiditySufficient = configManager.getValue(dbConfigVariable.humiditySufficient);

	assert(temperatureMax !== null, 'Temperature max is not set');
	assert(temperatureMin !== null, 'Temperature min is not set');
	assert(temperatureSufficient !== null, 'Temperature sufficient is not set');
	assert(humidityMax !== null, 'Humidity max is not set');
	assert(humidityMin !== null, 'Humidity min is not set');
	assert(humiditySufficient !== null, 'Humidity sufficient is not set');

	const ventilatorIsOn = outlet.isEnabled(outlet.slot.Ventilator);
	let newVentilatorState = ventilatorIsOn;
	// Turn ventilator on if temperature is too high
	if (temperature > temperatureMax) {
		newVentilatorState = true;
	}
	// Turn ventilator off if it's on and temperature is within range
	if (temperature <= temperatureSufficient) {
		newVentilatorState = false;
	}
	// Turn ventilator on if humidity is too high, but only if temperature is within range
	if (humidity > humidityMax && temperature > temperatureMin) {
		newVentilatorState = true;
	}

	const humidifierIsOn = outlet.isEnabled(outlet.slot.Humidifier);
	let newHumidifierState = humidifierIsOn;
	// Turn humidifier on if humidity is too low
	if (humidity < humidityMin) {
		newHumidifierState = true;
	}
	// Turn humidifier off if it's on and humidity is within range
	if (humidity >= humiditySufficient) {
		newHumidifierState = false;
	}

	if (newVentilatorState !== ventilatorIsOn) {
		await outlet.setState(outlet.slot.Ventilator, newVentilatorState);
		log(`Ventilator: ${newVentilatorState ? 'on' : 'off'}`, LogType.Info, false);
	}

	if (newHumidifierState !== humidifierIsOn) {
		await outlet.setState(outlet.slot.Humidifier, newHumidifierState);
		log(`Humidifier: ${newHumidifierState ? 'on' : 'off'}`, LogType.Info, false);
	}
}
