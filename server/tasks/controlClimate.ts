import { getHours, parse } from 'date-fns';
import { dbConfigVariable } from '../classes/ConfigManager';
import { LogType, log } from '../db/log';
import { climateObserver, configManager, outlet } from '../instances';

async function setLight(state: boolean) {
	await outlet.setState(outlet.slot.Light, state);
	log(`Light: ${state ? 'on' : 'off'}`, LogType.Info, false);
}

async function setVentilator(state: boolean) {
	await outlet.setState(outlet.slot.Ventilator, state);
	log(`Ventilator: ${state ? 'on' : 'off'}`, LogType.Info, false);
}

async function setHumidifier(state: boolean) {
	await outlet.setState(outlet.slot.Humidifier, state);
	log(`Humidifier: ${state ? 'on' : 'off'}`, LogType.Info, false);
}

async function setFan(state: boolean) {
	await outlet.setState(outlet.slot.Fan, state);
	log(`Fan: ${state ? 'on' : 'off'}`, LogType.Info, false);
}

async function runOffMode() {
	const lightIsOn = outlet.isEnabled(outlet.slot.Light);
	const ventilatorIsOn = outlet.isEnabled(outlet.slot.Ventilator);
	const humidifierIsOn = outlet.isEnabled(outlet.slot.Humidifier);
	const fanIsOn = outlet.isEnabled(outlet.slot.Fan);

	if (lightIsOn) {
		await setLight(false);
	}

	if (fanIsOn) {
		await setFan(false);
	}

	if (ventilatorIsOn) {
		await setVentilator(false);
	}

	if (humidifierIsOn) {
		await setHumidifier(false);
	}
}

async function runGrowMode() {
	const currentTime = Date.now();

	const lightIsOn = outlet.isEnabled(outlet.slot.Light);
	const ventilatorIsOn = outlet.isEnabled(outlet.slot.Ventilator);
	const humidifierIsOn = outlet.isEnabled(outlet.slot.Humidifier);
	const fanIsOn = outlet.isEnabled(outlet.slot.Fan);

	let newLightState = lightIsOn;
	let newVentilatorState = ventilatorIsOn;
	let newHumidifierState = humidifierIsOn;
	let newFanState = fanIsOn;

	const lightTurnOffTime = parse(
		configManager.getValue(dbConfigVariable.lightTurnOffTime),
		'HH:mm',
		new Date(),
	).getTime();
	const lightTurnOnTime = parse(
		configManager.getValue(dbConfigVariable.lightTurnOnTime),
		'HH:mm',
		new Date(),
	).getTime();
	if (lightIsOn) {
		if (currentTime >= lightTurnOffTime || currentTime < lightTurnOnTime) {
			newLightState = false;
		}
	} else if (currentTime >= lightTurnOnTime && currentTime < lightTurnOffTime) {
		newLightState = true;
	}

	if (newLightState !== lightIsOn) {
		await setLight(newLightState);
	}

	const fanTurnOffTime = parse(configManager.getValue(dbConfigVariable.fanTurnOffTime), 'HH:mm', new Date()).getTime();
	const fanTurnOnTime = parse(configManager.getValue(dbConfigVariable.fanTurnOnTime), 'HH:mm', new Date()).getTime();
	if (fanIsOn) {
		if (currentTime >= fanTurnOffTime || currentTime < fanTurnOnTime) {
			newFanState = false;
		}
	} else if (currentTime >= fanTurnOnTime && currentTime < fanTurnOffTime) {
		newFanState = true;
	}

	const { temperature, humidity } = climateObserver.getCurrentClimateData();

	if (!temperature || !humidity) {
		setHumidifier(false);
		setVentilator(true);
		setFan(true);
		log('No climate data, using fallback settings', LogType.Warning);
		return;
	}

	const temperatureMin = configManager.getValue(dbConfigVariable.temperatureMin);
	const temperatureMax = configManager.getValue(dbConfigVariable.temperatureMax);
	const temperatureSufficient = (temperatureMin + temperatureMax) / 2;
	const humidityMin = configManager.getValue(dbConfigVariable.humidityMin);
	const humidityMax = configManager.getValue(dbConfigVariable.humidityMax);
	const humiditySufficient = (humidityMin + humidityMax) / 2;

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

	// Turn humidifier on if humidity is too low
	if (humidity < humidityMin) {
		newHumidifierState = true;
	}
	// Turn humidifier off if it's on and humidity is within range
	if (humidity >= humiditySufficient) {
		newHumidifierState = false;
	}

	if (newHumidifierState) {
		newFanState = true;
	}

	if (newFanState !== fanIsOn) {
		await setFan(newFanState);
	}

	if (newVentilatorState !== ventilatorIsOn) {
		await setVentilator(newVentilatorState);
	}

	if (newHumidifierState !== humidifierIsOn) {
		await setHumidifier(newHumidifierState);
	}
}

async function runDryMode() {
	const lightIsOn = outlet.isEnabled(outlet.slot.Light);
	const ventilatorIsOn = outlet.isEnabled(outlet.slot.Ventilator);
	const humidifierIsOn = outlet.isEnabled(outlet.slot.Humidifier);
	const fanIsOn = outlet.isEnabled(outlet.slot.Fan);

	if (lightIsOn) {
		await setLight(false);
	}

	if (!fanIsOn) {
		await setFan(true);
	}

	const { temperature, humidity } = climateObserver.getCurrentClimateData();

	if (!temperature || !humidity) {
		setHumidifier(false);
		setVentilator(false);
		log('No climate data, using fallback settings', LogType.Warning);
		return;
	}

	const temperatureMin = configManager.getValue(dbConfigVariable.temperatureMin);
	const temperatureMax = configManager.getValue(dbConfigVariable.temperatureMax);
	const temperatureDifference = temperatureMax - temperatureMin;
	const temperatureToTurnOnVentilator = temperatureMin + temperatureDifference * 0.25;
	const temperatureToTurnOffVentilator = temperatureMin + temperatureDifference * 0.1;

	const humidityMin = configManager.getValue(dbConfigVariable.humidityMin);
	const humidityMax = configManager.getValue(dbConfigVariable.humidityMax);
	const humidityDifference = humidityMax - humidityMin;
	const humidityToTurnOffHumidifier = humidityMin + humidityDifference * 0.5;

	let newVentilatorState = ventilatorIsOn;
	let newHumidifierState = humidifierIsOn;

	const now = new Date();
	const isNight = getHours(now) >= 22 || getHours(now) < 9;
	const isDay = !isNight;

	// Summer hack to not heat up with room temperature
	if (isDay) {
		newVentilatorState = false;
	}

	// Summer hack to cool down at night
	if (temperature > temperatureToTurnOnVentilator && isNight) {
		newVentilatorState = true;
	}

	if (temperature < temperatureToTurnOffVentilator) {
		newVentilatorState = false;
	}

	if (humidity < humidityMin) {
		newHumidifierState = true;
	}

	if (humidity >= humidityToTurnOffHumidifier) {
		newHumidifierState = false;
	}

	if (newVentilatorState !== ventilatorIsOn) {
		await setVentilator(newVentilatorState);
	}

	if (newHumidifierState !== humidifierIsOn) {
		await setHumidifier(newHumidifierState);
	}
}

export async function controlClimate() {
	const mode = configManager.getValue(dbConfigVariable.mode);

	switch (mode) {
		case 'OFF':
			await runOffMode();
			break;
		case 'GROW':
			await runGrowMode();
			break;
		case 'DRY':
			await runDryMode();
			break;
		case 'APP_OFF':
			break;
		default:
			log(`Unknown mode: ${mode}`, LogType.Error);
	}
}
