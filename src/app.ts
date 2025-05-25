import { DhtSensor } from './classes/DhtSensor';
import { Outlet, SocketSlot } from './classes/Outlet';
import { Scheduler } from './classes/Scheduler';
import { config } from './config';
import { insertRecord } from './db/actions';
import { databaseClient } from './db/client';
import { LogType, log } from './db/log';
import { setupDatabase } from './db/setup';
import { stringifyError } from './utils';

const scheduler = new Scheduler();
const outlet = new Outlet();
const dht = new DhtSensor();

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
	await dht.read();
	if (dht.temperature === null || dht.humidity === null) {
		log('No DHT data available', LogType.Error);
		return;
	}

	const ventilatorIsOn = outlet.isEnabled(SocketSlot.Ventilator);
	let newVentilatorState = ventilatorIsOn;
	// Turn ventilator on if temperature is too high
	if (dht.temperature > config.tent.temperatureMax) {
		newVentilatorState = true;
	}
	// Turn ventilator off if it's on and temperature is within range
	if (dht.temperature < config.tent.temperatureMax - config.tent.temperatureRange) {
		newVentilatorState = false;
	}
	// Turn ventilator on if humidity is too high
	if (dht.humidity > config.tent.humidityMax) {
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

function collectRecords(timestamp: number) {
	log(
		`Collecting records t(${dht.temperature}); h(${dht.humidity}); v(${outlet.isEnabled(SocketSlot.Ventilator)}); h(${outlet.isEnabled(SocketSlot.Humidifier)}); l(${outlet.isEnabled(SocketSlot.Light)}); f(${outlet.isEnabled(SocketSlot.Fan)});`,
	);
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

async function setup() {
	try {
		console.clear();
		console.log('Setting up...');

		setupDatabase();
		await outlet.initialize();
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
