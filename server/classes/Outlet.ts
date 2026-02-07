import assert from 'node:assert/strict';
import WebSocket from 'ws';
import { LogType, log } from '../db/log';
import { configManager, envManager, socketManager } from '../instances';
import { stringifyError } from '../utils';
import { dbConfigVariable } from './ConfigManager';
import { envConfigVariable } from './EnvManager';

interface SocketSlots {
	Light: number | null;
	Ventilator: number | null;
	Humidifier: number | null;
	Fan: number | null;
}

interface JsonRpcRequest {
	id: number;
	src: string;
	method: string;
	params?: Record<string, unknown>;
}

export interface OutletStatus {
	isOn: boolean;
	activePower: number;
	voltage: number;
	current: number;
	powerFactor: number;
	totalEnergy: number;
}

interface SwitchStatus {
	id: number;
	source: string;
	output: boolean;
	apower: number;
	voltage: number;
	current: number;
	pf: number;
	aenergy: {
		total: number;
		by_minute: Array<number>;
		minute_ts: number;
	};
	temperature: {
		tC: number;
		tF: number;
	};
}

type RequestContext = { type: 'GetStatus'; slot: number } | { type: 'SetStatus'; slot: number; newState: boolean };

export class Outlet {
	private state = new Map<number, OutletStatus>();
	private webSocket: WebSocket | null = null;
	private messageId = 1;
	private requestContexts = new Map<number, RequestContext>();
	private reconnectTimer: NodeJS.Timeout | null = null;
	private isConnecting = false;

	public readonly slot: SocketSlots = {
		Light: null,
		Ventilator: null,
		Humidifier: null,
		Fan: null,
	};

	private getRpcId(): number {
		return this.messageId++;
	}

	private connect(): void {
		if (this.webSocket || this.isConnecting) {
			return;
		}

		this.isConnecting = true;
		const url = envManager.getValue(envConfigVariable.shellyOutletUrl);
		log(`Connecting to Outlet at ${url}...`, LogType.Info);

		this.webSocket = new WebSocket(url);

		this.webSocket.on('open', () => {
			log('Outlet WebSocket connected', LogType.Info);
			this.isConnecting = false;
			if (this.reconnectTimer) {
				clearTimeout(this.reconnectTimer);
				this.reconnectTimer = null;
			}

			// Initial state fetch upon connection
			this.fetchState();
		});

		this.webSocket.on('message', (data: WebSocket.RawData) => {
			this.handleMessage(data);
		});

		this.webSocket.on('error', (err) => {
			log(`Outlet WebSocket error: ${stringifyError(err)}`, LogType.Error);
		});

		this.webSocket.on('close', () => {
			log('Outlet WebSocket disconnected', LogType.Warning);
			this.webSocket = null;
			this.isConnecting = false;
			this.requestContexts.clear();
			this.scheduleReconnect();
		});
	}

	private scheduleReconnect(): void {
		if (this.reconnectTimer) {
			return;
		}

		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null;
			this.connect();
		}, 5000);
	}

	private handleMessage(data: WebSocket.RawData): void {
		try {
			const message = JSON.parse(data.toString());

			// Handle RPC Responses
			if (message.id) {
				const context = this.requestContexts.get(message.id);
				if (context) {
					this.requestContexts.delete(message.id);

					if (!message.error && message.result) {
						if (context.type === 'GetStatus') {
							// For GetStatus, result is SwitchStatus
							this.updateStateFromStatus(context.slot, message.result as SwitchStatus);
						}
						// For SetStatus, the result is typically null or success confirmation.
						// Real state update comes via NotifyStatus or we rely on optimistic update.
					} else if (message.error) {
						log(`RPC Error for ${context.type}: ${message.error.message}`, LogType.Error);
						// If SetStatus failed, revert optimistic update
						if (context.type === 'SetStatus') {
							const currentState = this.state.get(context.slot);
							if (currentState) {
								this.state.set(context.slot, { ...currentState, isOn: !context.newState });
							}
						}
					}
				}
				return;
			}

			// Handle Notifications (NotifyStatus)
			if (message.method === 'NotifyStatus' && message.params) {
				this.updateStateFromNotification(message.params);
			}
		} catch (error) {
			log(`Error handling message: ${stringifyError(error)}`, LogType.Error);
		}
	}

	private updateStateFromStatus(slot: number, status: SwitchStatus): void {
		this.state.set(slot, {
			isOn: Boolean(status.output),
			activePower: status.apower,
			voltage: status.voltage,
			current: status.current,
			powerFactor: status.pf,
			totalEnergy: status.aenergy.total,
		});

		socketManager.emitOutletState(this.getAllStates());
	}

	private updateStateFromNotification(params: Record<string, unknown>): void {
		// Shelly Gen2 notifications structure: { "switch:0": { "output": true, "apower": 20.3, ... }, "ts": 123456789 }
		// We iterate over the params to find switch status updates
		const activeSlots = Object.values(this.slot).filter((s): s is number => s !== null);

		for (const key in params) {
			if (key.startsWith('switch:')) {
				const idStr = key.split(':')[1];
				const shellyId = Number.parseInt(idStr, 10);

				const param = params[key];
				if (!Number.isNaN(shellyId) && param && typeof param === 'object') {
					// Map 0-based Shelly ID back to our 1-based slot (slot = shellyId + 1)
					const slot = shellyId + 1;

					if (activeSlots.includes(slot)) {
						const currentState = this.state.get(slot);
						if (currentState) {
							// Check for specific fields and update if present
							// We cast 'param' to any/Record to access properties safely since we checked it's an object
							const p = param as Record<string, unknown>;

							const updates: Partial<OutletStatus> = {};

							if ('output' in p && typeof p.output === 'boolean') {
								updates.isOn = p.output;
							}
							if ('apower' in p && typeof p.apower === 'number') {
								updates.activePower = p.apower;
							}
							if ('voltage' in p && typeof p.voltage === 'number') {
								updates.voltage = p.voltage;
							}
							if ('current' in p && typeof p.current === 'number') {
								updates.current = p.current;
							}
							if ('pf' in p && typeof p.pf === 'number') {
								updates.powerFactor = p.pf;
							}

							if ('aenergy' in p && typeof p.aenergy === 'object' && p.aenergy && 'total' in p.aenergy) {
								updates.totalEnergy = (p.aenergy as { total: number }).total;
							}

							log(`Outlet state updated for slot ${slot}: ${JSON.stringify(updates)}`, LogType.Info);

							this.state.set(slot, {
								...currentState,
								...updates,
							});

							socketManager.emitOutletState(this.getAllStates());
						}
					}
				}
			}
		}
	}

	private waitForConnection(): boolean {
		if (this.webSocket?.readyState === WebSocket.OPEN) {
			return true;
		}
		if (!this.webSocket && !this.isConnecting) {
			this.connect();
		}
		return false;
	}

	private sendCommand(method: string, params: Record<string, unknown>, context?: RequestContext): void {
		if (!this.waitForConnection()) {
			log(`Cannot send command ${method}: Socket not ready`, LogType.Warning);
			return;
		}

		const id = this.getRpcId();
		const request: JsonRpcRequest = {
			id,
			src: 'kyti-server',
			method,
			params,
		};

		if (context) {
			this.requestContexts.set(id, context);
		}

		try {
			this.webSocket?.send(JSON.stringify(request));
		} catch (error) {
			log(`Failed to send command ${method}: ${stringifyError(error)}`, LogType.Error);
			this.requestContexts.delete(id);
		}
	}

	public fetchState(): void {
		const activeSlots = Object.values(this.slot).filter((s): s is number => s !== null);

		for (const slot of activeSlots) {
			const shellyId = slot - 1;
			this.sendCommand('Switch.GetStatus', { id: shellyId }, { type: 'GetStatus', slot });
		}
	}

	public initialize(): void {
		this.slot.Light = configManager.getValue(dbConfigVariable.outletSlotLight);
		this.slot.Ventilator = configManager.getValue(dbConfigVariable.outletSlotVentilator);
		this.slot.Humidifier = configManager.getValue(dbConfigVariable.outletSlotHumidifier);
		this.slot.Fan = configManager.getValue(dbConfigVariable.outletSlotFan);

		// Start persistent connection
		this.connect();
	}

	public isEnabled(socket: number | null): boolean {
		assert(socket !== null, 'Socket is not set');
		return Boolean(this.state.get(socket)?.isOn);
	}

	public setState(socket: number | null, newState: boolean): boolean {
		assert(socket !== null, 'Socket is not set');

		const shellyId = socket - 1;

		// Optimistic update
		const currentState = this.state.get(socket);
		if (currentState) {
			this.state.set(socket, { ...currentState, isOn: newState });
			socketManager.emitOutletState(this.getAllStates());
		}

		this.sendCommand('Switch.Set', { id: shellyId, on: newState }, { type: 'SetStatus', slot: socket, newState });

		return newState;
	}

	public getAllStates(): Record<number, OutletStatus> {
		return Object.fromEntries(this.state);
	}
}
