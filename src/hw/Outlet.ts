import TuyAPI, { type DPSObject } from 'tuyapi';
import { stringifyError } from '../utils';

interface OutletConfig {
	id: string;
	key: string;
	outlet: number;
}

export class Outlet {
	private id: string;
	private key: string;

	private device: TuyAPI;
	private found: boolean;
	private enabled: boolean | null;

	constructor(config: OutletConfig) {
		this.id = config.id;
		this.key = config.key;

		this.device = new TuyAPI({
			id: this.id,
			key: this.key,
			issueGetOnConnect: false,
		});
		this.found = false;
		this.enabled = null;
	}

	private async connect(): Promise<void> {
		if (!this.found) {
			await this.device.find();
			this.found = true;
		}
		await this.device.connect();
	}

	private disconnect(): void {
		this.device.disconnect();
	}

	private async switch(on: boolean): Promise<boolean> {
		try {
			await this.connect();
			const result = await this.device.set({ dps: this.outlet, set: on });
			return result.dps[this.outlet] === on;
		} catch (error) {
			console.error('Outlet switch error: ', stringifyError(error));
			return false;
		} finally {
			this.disconnect();
		}
	}

	public async turnOn(): Promise<boolean> {
		const ack = await this.switch(true);
		return ack;
	}

	public async turnOff(): Promise<boolean> {
		const ack = await this.switch(false);
		return ack;
	}

	public async retrieveEnabledState(): Promise<void> {
		try {
			await this.connect();
			const result = (await this.device.get({ schema: true })) as DPSObject;
			this.enabled = Boolean(result.dps[this.outlet]);
		} catch (error) {
			console.error('Outlet retrieve enabled state error: ', stringifyError(error));
		} finally {
			this.disconnect();
		}
	}

	public get isEnabled(): boolean {
		if (this.enabled === null) {
			console.warn('Call retrieveEnabledState() to get the current enabled state');
		}
		return this.enabled ?? false;
	}
}
