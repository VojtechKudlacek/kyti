import { parse } from 'date-fns';
import { dbConfigVariable } from '../classes/ConfigManager';
import { LogType, log } from '../db/log';
import { configManager, outlet } from '../instances';

export async function switchDevices() {
	const isEnabled = configManager.getValue(dbConfigVariable.taskSwitchDevices);
	if (!isEnabled) {
		return;
	}

	const currentTime = Date.now();

	const lightIsOn = outlet.isEnabled(outlet.slot.Light);
	let newLightState = lightIsOn;
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

	const fanIsOn = outlet.isEnabled(outlet.slot.Fan);
	let newFanState = fanIsOn;
	const fanTurnOffTime = parse(configManager.getValue(dbConfigVariable.fanTurnOffTime), 'HH:mm', new Date()).getTime();
	const fanTurnOnTime = parse(configManager.getValue(dbConfigVariable.fanTurnOnTime), 'HH:mm', new Date()).getTime();
	if (fanIsOn) {
		if (currentTime >= fanTurnOffTime || currentTime < fanTurnOnTime) {
			newFanState = false;
		}
	} else if (currentTime >= fanTurnOnTime && currentTime < fanTurnOffTime) {
		newFanState = true;
	}

	if (newLightState !== lightIsOn) {
		await outlet.setState(outlet.slot.Light, newLightState);
		log(`Light: ${newLightState ? 'on' : 'off'}`, LogType.Info, false);
	}

	if (newFanState !== fanIsOn) {
		await outlet.setState(outlet.slot.Fan, newFanState);
		log(`Fan: ${newFanState ? 'on' : 'off'}`, LogType.Info, false);
	}
}
