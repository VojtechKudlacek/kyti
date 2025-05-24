import './config';
import { databaseClient } from './db/client';
import { LogType, log } from './db/log';
import { setupDatabase } from './db/setup';
import { SocketSlot, isSocketEnabled, retrieveOutletEnabledState, setSocketState } from './hw/outlet';
import { stringifyError } from './utils';

let runtimeInterval: NodeJS.Timeout;

function terminate(reason: string, exitCode = 0) {
	log(`Terminating process: ${reason}`, exitCode === 0 ? LogType.Info : LogType.Error);
	databaseClient.close();
	if (runtimeInterval) {
		clearInterval(runtimeInterval);
	}
	process.exit(exitCode);
}

function run() {
	try {
		console.log('Running...');
		console.log(isSocketEnabled(SocketSlot.Light));
		setSocketState(SocketSlot.Light, true);
	} catch (error) {
		terminate(`Runtime error - ${stringifyError(error)}`, 1);
	}
}

async function setup() {
	try {
		setupDatabase();
		await retrieveOutletEnabledState();
		runtimeInterval = setInterval(run, 5 * 1000); // 5 seconds
	} catch (error) {
		terminate(`Setup error - ${stringifyError(error)}`, 1);
	}
}

setup();
