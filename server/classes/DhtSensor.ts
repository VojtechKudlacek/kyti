import { spawnSync } from 'node:child_process';
import { type SensorData, type SensorType, promises as sensorPromises } from 'node-dht-sensor';
import { config } from '../config';
import { LogType, log } from '../db/log';
import { stringifyError, timeoutPromise } from '../utils';

export class DhtSensor {
	private _temperature: number | null = null;
	private _humidity: number | null = null;

	private _v = config.dht.version as SensorType;
	private _pin = config.dht.pin;

	public initialize(): void {
		sensorPromises.setMaxRetries(5);
		sensorPromises.initialize(this._v, this._pin);
	}

	private async readWithOneRetry(): Promise<SensorData> {
		let attempt = 0;
		while (true) {
			try {
				return await timeoutPromise(() => sensorPromises.read(this._v, this._pin), 5000);
			} catch (error) {
				if (attempt === 1) {
					throw error;
				}
				log('Restarting DHT sensor...');
				spawnSync('gpioset', ['gpiochip0', '17=0'], { encoding: 'utf-8' });
				await new Promise((resolve) => setTimeout(resolve, 20000));
				spawnSync('gpioset', ['gpiochip0', '17=1'], { encoding: 'utf-8' });
				attempt++;
			}
		}
	}

	public async read(): Promise<void> {
		try {
			const { humidity, temperature } = await this.readWithOneRetry();
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
