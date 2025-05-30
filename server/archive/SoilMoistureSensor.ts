import type { SpiDevice } from 'spi-device';
import { stringifyError } from '../utils';

interface SensorConfig {
	id: number;
	channel: number;
	spiDevice: SpiDevice;
}

// TODO: Implement this class once the sensor is connected
export class SoilMoistureSensor {
	private channel: number;
	private spiDevice: SpiDevice;
	private lastMoistureValue: number | null;

	public readonly id: number;

	constructor(config: SensorConfig) {
		this.id = config.id;
		this.spiDevice = config.spiDevice;
		this.channel = config.channel;
		this.lastMoistureValue = null;
	}

	public async getSensorData(): Promise<number | null> {
		return new Promise((resolve, reject) => {
			if (this.channel < 0 || this.channel > 7) {
				console.error(`SoilMoistureSensor(${this.id}) channel must be between 0 and 7`, this.channel);
				return reject(null);
			}

			const configBits = 0x80 | (this.channel << 4); // 10000000 | (channel << 4)
			const message = [
				{
					sendBuffer: Buffer.from([0x01, configBits, 0x00]),
					receiveBuffer: Buffer.alloc(3),
					byteLength: 3,
					speedHz: 1350000,
				},
			];

			this.spiDevice.transfer(message, (err, response) => {
				if (err) {
					console.error(`SoilMoistureSensor(${this.id}) transfer error`, stringifyError(err));
					return reject(err);
				}

				const rb = response[0].receiveBuffer;
				if (!rb) {
					console.error(`SoilMoistureSensor(${this.id}) no response received`);
					return reject(null);
				}

				const value = ((rb[1] & 0x03) << 8) | rb[2]; // Extract 10-bit value
				this.lastMoistureValue = value;
				resolve(value);
			});
		});
	}

	public get moisture(): number | null {
		return this.lastMoistureValue;
	}
}
