import type { SpiDevice } from 'spi-device';
import { config, outlets } from './config';
import { type DatabaseClient, getDatabaseClient } from './db/client';
import { setupDatabase } from './db/setup';
import { Outlet } from './hw/Outlet';
import { getSpiDevice } from './spi';

const frequency = 1000;

async function run() {
	let db: DatabaseClient | null = null;
	let _spi: SpiDevice | null = null;

	try {
		db = getDatabaseClient();
		setupDatabase(db);
		_spi = await getSpiDevice();

		const ventilatorOutlet = new Outlet({
			id: config.deviceId,
			key: config.deviceKey,
			outlet: outlets.ventilator,
		});

		console.log(await ventilatorOutlet.turnOn());
		await new Promise((resolve) => setTimeout(resolve, 5000));
		console.log(await ventilatorOutlet.turnOff());
	} catch (error) {
		console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
		process.exit(1);
	} finally {
		db?.close();
	}
}

run();
