import { type SensorType, promises as sensorPromises } from 'node-dht-sensor';
import { config } from '../config';
import { LogType, log } from '../db/log';
import { retryPromiseWithTimeout, stringifyError } from '../utils';

export class DhtSensor {
	private _temperature: number | null = null;
	private _humidity: number | null = null;

	public initialize(): void {
		sensorPromises.setMaxRetries(5);
		sensorPromises.initialize(config.dht.version as SensorType, config.dht.pin);
	}

	public async read(): Promise<void> {
		try {
			const { humidity, temperature } = await retryPromiseWithTimeout(() => sensorPromises.read());
			this._temperature = Number.parseFloat(temperature.toFixed(1));
			this._humidity = Number.parseFloat(humidity.toFixed(1));
		} catch (error) {
			this._temperature = null;
			this._humidity = null;
			log(`Failed to read DHT sensor data: ${stringifyError(error)}`, LogType.Error);
		}
	}

	public get temperature(): number | null {
		return this._temperature;
	}

	public get humidity(): number | null {
		return this._humidity;
	}
}
