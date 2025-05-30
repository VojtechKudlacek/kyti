import TuyAPI, { type DPSObject } from 'tuyapi';
import { config } from '../config';
import { LogType, log } from '../db/log';
import { stringifyError } from '../utils';

export const SocketSlot = {
	Light: config.outlet.slots.light,
	Ventilator: config.outlet.slots.ventilator,
	Fan: config.outlet.slots.fan,
	Humidifier: config.outlet.slots.humidifier,
} as const;

const keepAliveMiliseconds = 10_000; // 10 seconds

export class Outlet {
	private state = new Map<number, boolean>();
	private api = new TuyAPI({
		id: config.outlet.id,
		key: config.outlet.key,
		issueGetOnConnect: false,
	});
	private scheduledDisconnect: NodeJS.Timeout | null = null;

	private async connect(): Promise<void> {
		if (this.api.isConnected()) {
			return;
		}
		const connected = await this.api.connect();
		if (!connected) {
			throw new Error('Failed to connect to outlet');
		}
	}

	private disconnect(): void {
		if (this.scheduledDisconnect) {
			clearTimeout(this.scheduledDisconnect);
		}
		this.scheduledDisconnect = setTimeout(() => {
			if (this.api.isConnected()) {
				this.api.disconnect();
				this.scheduledDisconnect = null;
			}
		}, keepAliveMiliseconds);
	}

	public async fetchState(): Promise<void> {
		await this.connect();
		const schema = (await this.api.get({ schema: true })) as DPSObject;
		for (const slot of Object.values<number>(config.outlet.slots)) {
			const slotValue = schema.dps[slot];
			this.state.set(slot, Boolean(slotValue));
		}
		this.disconnect();
	}

	public async initialize(): Promise<void> {
		await this.api.find();
		await this.fetchState();
	}

	public isEnabled(socket: number): boolean {
		return Boolean(this.state.get(socket));
	}

	public async setState(socket: number, newState: boolean): Promise<boolean> {
		try {
			const connected = await this.api.connect();
			if (!connected) {
				throw new Error('Failed to connect to outlet');
			}
			const response = await this.api.set({ dps: socket, set: newState });
			const result = Boolean(response.dps[socket]);
			this.state.set(socket, result);
			return result;
		} catch (error) {
			log(`Outlet switch error: ${stringifyError(error)}`, LogType.Error);
			throw error;
		} finally {
			this.api.disconnect();
		}
	}
}
