import assert from 'node:assert/strict';
import TuyAPI, { type DPSObject } from 'tuyapi';
import { LogType, log } from '../db/log';
import { configManager, envManager } from '../instances';
import { stringifyError } from '../utils';
import { dbConfigVariable } from './ConfigManager';
import { envConfigVariable } from './EnvManager';

interface SocketSlots {
	Light: number | null;
	Ventilator: number | null;
	Humidifier: number | null;
	Fan: number | null;
}

const keepAliveMiliseconds = 10_000; // 10 seconds

export class Outlet {
	private state = new Map<number, boolean>();
	private api: TuyAPI | null = null;
	private scheduledDisconnect: NodeJS.Timeout | null = null;

	public readonly slot: SocketSlots = {
		Light: null,
		Ventilator: null,
		Humidifier: null,
		Fan: null,
	};

	private async connect(): Promise<void> {
		assert(this.api, 'Outlet API is not initialized');
		if (this.api.isConnected()) {
			return;
		}
		const connected = await this.api.connect();
		assert(connected, 'Failed to connect to outlet');
	}

	private disconnect(): void {
		if (this.scheduledDisconnect) {
			clearTimeout(this.scheduledDisconnect);
		}
		this.scheduledDisconnect = setTimeout(() => {
			if (this.api?.isConnected()) {
				this.api.disconnect();
				this.scheduledDisconnect = null;
			}
		}, keepAliveMiliseconds);
	}

	public async fetchState(): Promise<void> {
		await this.connect();
		const schema = (await this.api?.get({ schema: true })) as DPSObject;
		for (const slot of Object.values(this.slot)) {
			const slotValue = schema.dps[slot];
			this.state.set(slot, Boolean(slotValue));
		}
		this.disconnect();
	}

	public async initialize(): Promise<void> {
		this.api = new TuyAPI({
			id: envManager.getValue(envConfigVariable.tuyaOutletDeviceId),
			key: envManager.getValue(envConfigVariable.tuyaOutletDeviceKey),
			issueGetOnConnect: false,
		});
		this.slot.Light = configManager.getValue(dbConfigVariable.outletSlotLight);
		this.slot.Ventilator = configManager.getValue(dbConfigVariable.outletSlotVentilator);
		this.slot.Humidifier = configManager.getValue(dbConfigVariable.outletSlotHumidifier);
		this.slot.Fan = configManager.getValue(dbConfigVariable.outletSlotFan);
		await this.api.find();
		await this.fetchState();
	}

	public isEnabled(socket: number | null): boolean {
		assert(socket !== null, 'Socket is not set');
		return Boolean(this.state.get(socket));
	}

	public async setState(socket: number | null, newState: boolean): Promise<boolean> {
		assert(socket !== null, 'Socket is not set');
		try {
			await this.connect();
			const response = await this.api?.set({ dps: socket, set: newState });
			assert(response, 'Failed to set outlet state');
			const result = Boolean(response.dps[socket]);
			this.state.set(socket, result);
			return result;
		} catch (error) {
			log(`Outlet switch error: ${stringifyError(error)}`, LogType.Error);
			throw error;
		} finally {
			this.disconnect();
		}
	}
}
