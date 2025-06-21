import assert from 'node:assert/strict';
import dayjs from 'dayjs';
import { dbConfigVariable } from '../classes/ConfigManager';
import { LogType, log } from '../db/log';
import { climateObserver, configManager, outlet } from '../instances';

export async function controlClimate() {
	if (!configManager.getValue(dbConfigVariable.taskClimateControl)) {
		return;
	}

	const currentTime = Date.now();

	const lightIsOn = outlet.isEnabled(outlet.slot.Light);
	let newLightState = lightIsOn;
	const lightTurnOffTime = dayjs(configManager.getValue(dbConfigVariable.lightTurnOffTime), 'HH:mm').valueOf();
	const lightTurnOnTime = dayjs(configManager.getValue(dbConfigVariable.lightTurnOnTime), 'HH:mm').valueOf();
	if (lightIsOn) {
		if (currentTime >= lightTurnOffTime || currentTime < lightTurnOnTime) {
			newLightState = false;
		}
	} else if (currentTime >= lightTurnOnTime && currentTime < lightTurnOffTime) {
		newLightState = true;
	}

	if (newLightState !== lightIsOn) {
		await outlet.setState(outlet.slot.Light, newLightState);
		log(`Light: ${newLightState ? 'on' : 'off'}`, LogType.Info, false);
	}

	const fanIsOn = outlet.isEnabled(outlet.slot.Fan);
	let newFanState = fanIsOn;
	const fanTurnOffTime = dayjs(configManager.getValue(dbConfigVariable.fanTurnOffTime), 'HH:mm').valueOf();
	const fanTurnOnTime = dayjs(configManager.getValue(dbConfigVariable.fanTurnOnTime), 'HH:mm').valueOf();
	if (fanIsOn) {
		if (currentTime >= fanTurnOffTime || currentTime < fanTurnOnTime) {
			newFanState = false;
		}
	} else if (currentTime >= fanTurnOnTime && currentTime < fanTurnOffTime) {
		newFanState = true;
	}

	if (newFanState !== fanIsOn) {
		await outlet.setState(outlet.slot.Fan, newFanState);
		log(`Fan: ${newFanState ? 'on' : 'off'}`, LogType.Info, false);
	}

	const { temperature, humidity } = climateObserver.getCurrentClimateData();

	assert(temperature !== null, 'Temperature is outdated for climate control');
	assert(humidity !== null, 'Humidity is outdated for climate control');

	const temperatureMin = configManager.getValue(dbConfigVariable.temperatureMin);
	const temperatureMax = configManager.getValue(dbConfigVariable.temperatureMax);
	const temperatureSufficient = (temperatureMin + temperatureMax) / 2;
	const humidityMin = configManager.getValue(dbConfigVariable.humidityMin);
	const humidityMax = configManager.getValue(dbConfigVariable.humidityMax);
	const humiditySufficient = (humidityMin + humidityMax) / 2;

	const ventilatorIsOn = outlet.isEnabled(outlet.slot.Ventilator);
	let newVentilatorState = ventilatorIsOn;
	// Turn ventilator off if light is off and temperature is too high (at night)
	if (!newLightState && temperature < temperatureMax) {
		newVentilatorState = false;
	}
	// Turn ventilator on if temperature is too high
	if (temperature > temperatureMax) {
		newVentilatorState = true;
	}
	// Turn ventilator off if it's on and temperature is within range
	if (temperature <= temperatureSufficient) {
		newVentilatorState = false;
	}
	// Turn ventilator on if humidity is too high, but only if temperature is within range
	if (humidity > humidityMax && temperature >= temperatureSufficient) {
		newVentilatorState = true;
	}

	if (newVentilatorState !== ventilatorIsOn) {
		await outlet.setState(outlet.slot.Ventilator, newVentilatorState);
		log(`Ventilator: ${newVentilatorState ? 'on' : 'off'}`, LogType.Info, false);
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

	if (newHumidifierState !== humidifierIsOn) {
		await outlet.setState(outlet.slot.Humidifier, newHumidifierState);
		log(`Humidifier: ${newHumidifierState ? 'on' : 'off'}`, LogType.Info, false);
	}
}
