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

const outletState = new Map<number, boolean>();
const outletApi = new TuyAPI({
	id: config.outlet.id,
	key: config.outlet.key,
	issueGetOnConnect: false,
});

let outletFound = false;
async function executeOutletAction<T>(action: () => Promise<T>) {
	try {
		if (!outletFound) {
			await outletApi.find();
			outletFound = true;
		}
		await outletApi.connect();
		return await action();
	} finally {
		outletApi.disconnect();
	}
}

export function retrieveOutletEnabledState(): Promise<void> {
	return executeOutletAction(async function () {
		try {
			const schema = (await outletApi.get({ schema: true })) as DPSObject;
			for (const slot of Object.values<number>(config.outlet.slots)) {
				const slotValue = schema.dps[slot];
				outletState.set(slot, Boolean(slotValue));
			}
		} catch (error) {
			log(`Outlet retrieve enabled state error: ${stringifyError(error)}`, LogType.Error);
			throw error;
		}
	});
}

export function isSocketEnabled(slot: number): boolean {
	if (!outletState.has(slot)) {
		log('Call retrieveOutletEnabledState() to get the current enabled state', LogType.Warning);
		return false;
	}
	return Boolean(outletState.get(slot));
}

export function setSocketState(slot: number, newState: boolean): Promise<boolean> {
	return executeOutletAction(async function () {
		try {
			const response = await outletApi.set({ dps: slot, set: newState });
			const result = response.dps[slot] === newState;
			outletState.set(slot, result);
			return result;
		} catch (error) {
			log(`Outlet switch error: ${stringifyError(error)}`, LogType.Error);
			throw error;
		}
	});
}
