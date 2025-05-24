import { promises as sensorPromises } from 'node-dht-sensor';
import { LogType, log } from '../db/log';
import { stringifyError } from '../utils';

interface Dht22Data {
	humidity: number | null;
	temperature: number | null;
}

export async function getDhtData(): Promise<Dht22Data | null> {
	try {
		const { humidity, temperature } = await sensorPromises.read(22, 4);
		return { humidity, temperature };
	} catch (error) {
		log(`Failed to read DHT22 data: ${stringifyError(error)}`, LogType.Error);
		return null;
	}
}
