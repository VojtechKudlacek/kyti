import type { SpiDevice } from 'spi-device';
import { stringifyError } from '../utils';

interface SensorConfig {
	id: number;
	channel: number;
	spiDevice: SpiDevice;
}

export class SoilMoistureSensor {
	private _channel: number;
	private _spiDevice: SpiDevice;
	private _lastMoistureValue: number | null;

	public readonly id: number;

	constructor(config: SensorConfig) {
		this.id = config.id;
		this._spiDevice = config.spiDevice;
		this._channel = config.channel;
		this._lastMoistureValue = null;
	}

	public async getSensorData(): Promise<number | null> {
		return new Promise((resolve, reject) => {
			if (this._channel < 0 || this._channel > 7) {
				console.error(`SoilMoistureSensor(${this.id}) channel must be between 0 and 7`, this._channel);
				return reject(null);
			}

			const configBits = 0x80 | (this._channel << 4); // 10000000 | (channel << 4)
			const message = [
				{
					sendBuffer: Buffer.from([0x01, configBits, 0x00]),
					receiveBuffer: Buffer.alloc(3),
					byteLength: 3,
					speedHz: 1350000,
				},
			];

			this._spiDevice.transfer(message, (err, response) => {
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
				this._lastMoistureValue = value;
				resolve(value);
			});
		});
	}

	public get moisture(): number | null {
		return this._lastMoistureValue;
	}
}
