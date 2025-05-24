import { Scheduler } from './classes/Scheduler';
import { config } from './config';
import { insertRecord } from './db/actions';
import { databaseClient } from './db/client';
import { LogType, log } from './db/log';
import { setupDatabase } from './db/setup';
import { getDhtData } from './hw/dht';
import { SocketSlot, isSocketEnabled, retrieveOutletEnabledState, setSocketState } from './hw/outlet';
import { stringifyError } from './utils';

const scheduler = new Scheduler();

let isTerminating = false;
function terminate(reason: string, exitCode = 0) {
	if (isTerminating) {
		return;
	}
	isTerminating = true;
	log(`Terminating process: ${reason}`, exitCode === 0 ? LogType.Info : LogType.Error);
	scheduler.stop();
	databaseClient.close();
	// Give a small grace period for cleanup operations
	setTimeout(() => process.exit(exitCode), 100);
}

async function controlClimate() {
	const dhtData = await getDhtData();
	if (dhtData === null) {
		log('No DHT data available', LogType.Error);
		return;
	}

	const ventilatorIsOn = isSocketEnabled(SocketSlot.Ventilator);
	let newVentilatorState = ventilatorIsOn;
	// Turn ventilator on if temperature is too high
	if (dhtData.temperature > config.tent.temperatureMax) {
		newVentilatorState = true;
	}
	// Turn ventilator off if it's on and temperature is within range
	if (dhtData.temperature < config.tent.temperatureMax - config.tent.temperatureRange) {
		newVentilatorState = false;
	}
	// Turn ventilator on if humidity is too high
	if (dhtData.humidity > config.tent.humidityMax) {
		newVentilatorState = true;
	}

	const humidifierIsOn = isSocketEnabled(SocketSlot.Humidifier);
	let newHumidifierState = humidifierIsOn;
	// Turn humidifier on if humidity is too low
	if (dhtData.humidity < config.tent.humidityMin) {
		newHumidifierState = true;
	}
	// Turn humidifier off if it's on and humidity is within range
	if (dhtData.humidity > config.tent.humidityMin + config.tent.humidityRange) {
		newHumidifierState = false;
	}

	await setSocketState(SocketSlot.Ventilator, newVentilatorState);
	await setSocketState(SocketSlot.Humidifier, newHumidifierState);
}

async function collectRecords() {
	const dhtData = await getDhtData();
	insertRecord({
		temperature: dhtData?.temperature ?? null,
		humidity: dhtData?.humidity ?? null,
		light: isSocketEnabled(SocketSlot.Light),
		fan: isSocketEnabled(SocketSlot.Fan),
		humidifier: isSocketEnabled(SocketSlot.Humidifier),
		ventilator: isSocketEnabled(SocketSlot.Ventilator),
	});
}

async function setup() {
	try {
		console.log('Setting up...');
		setupDatabase();
		await retrieveOutletEnabledState();
		scheduler.addTask('Climate Controller', 1, controlClimate);
		scheduler.addTask('Records Collector', 1, collectRecords);
		scheduler.start();
		console.log('Setup complete');
	} catch (error) {
		terminate(`Setup error - ${stringifyError(error)}`, 1);
	}
}

setup();

process.on('SIGINT', () => terminate('SIGINT')); // Ctrl+C
process.on('SIGTERM', () => terminate('SIGTERM')); // PM2, systemd, docker, kubernetes
process.on('SIGQUIT', () => terminate('SIGQUIT')); // SIGINT with core dump
process.on('SIGHUP', () => terminate('SIGHUP')); // Terminal closed, PM2 reload
process.on('uncaughtException', (error) => terminate(`Uncaught Exception: ${stringifyError(error)}`, 1)); // Handle uncaught errors
process.on('unhandledRejection', (reason) => terminate(`Unhandled Rejection: ${stringifyError(reason)}`, 1)); // Handle unhandled promise rejections
