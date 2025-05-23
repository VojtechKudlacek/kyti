import { promises as sensorPromises } from 'node-dht-sensor';

interface Dht22Data {
	humidity: number | null;
	temperature: number | null;
}

export async function getDht22Data(): Promise<Dht22Data> {
	try {
		const { humidity, temperature } = await sensorPromises.read(22, 4);
		return { humidity, temperature };
	} catch (error) {
		console.error('Failed to read DHT22 data:', error);
		return { humidity: null, temperature: null };
	}
}
