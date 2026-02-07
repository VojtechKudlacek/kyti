import assert from 'node:assert/strict';
import WebSocket from 'ws';
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

interface JsonRpcRequest {
	id: number;
	src: string;
	method: string;
	params?: Record<string, unknown>;
}

interface JsonRpcResponse<T = unknown> {
	id: number;
	src: string;
	dst: string;
	result?: T;
	error?: {
		code: number;
		message: string;
	};
}

interface SwitchStatus {
	id: number;
	source: string;
	output: boolean;
	apower: number;
	voltage: number;
	current: number;
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

export class Outlet {
	private state = new Map<number, boolean>();
	private socket: WebSocket | null = null;
	private messageId = 1;

	public readonly slot: SocketSlots = {
		Light: null,
		Ventilator: null,
		Humidifier: null,
		Fan: null,
	};

	private getRpcId(): number {
		return this.messageId++;
	}

	private async connect(): Promise<void> {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			return;
		}

		const url = envManager.getValue(envConfigVariable.shellyOutletUrl);
		this.socket = new WebSocket(url);

		await new Promise<void>((resolve, reject) => {
			if (!this.socket) {
				return reject(new Error('Socket not initialized'));
			}

			const timeout = setTimeout(() => {
				if (this.socket) {
					this.socket.terminate();
				}
				reject(new Error('Connection timeout'));
			}, 5000);

			this.socket.once('open', () => {
				clearTimeout(timeout);
				resolve();
			});

			this.socket.once('error', (err) => {
				clearTimeout(timeout);
				reject(err);
			});

			this.socket.once('close', () => {
				this.socket = null;
			});
		});
	}

	private async callRpc<T>(method: string, params?: Record<string, unknown>): Promise<T> {
		await this.connect();
		assert(this.socket, 'Socket not initialized');

		return new Promise((resolve, reject) => {
			const id = this.getRpcId();
			const request: JsonRpcRequest = {
				id,
				src: 'kyti-server',
				method,
				params,
			};

			const handleMessage = (data: WebSocket.RawData) => {
				try {
					const response = JSON.parse(data.toString()) as JsonRpcResponse<T>;
					if (response.id === id) {
						this.socket?.off('message', handleMessage);
						if (response.error) {
							reject(new Error(`RPC Error: ${response.error.message} (${response.error.code})`));
						} else {
							// result is optional in JSON-RPC 2.0 success response if it's null, but here we expect T
							resolve(response.result as T);
						}
					}
				} catch (_error) {
					// Ignore parse errors or messages meant for other requests
				}
			};

			this.socket?.on('message', handleMessage);
			this.socket?.send(JSON.stringify(request));

			// Timeout for RPC call
			setTimeout(() => {
				this.socket?.off('message', handleMessage);
				reject(new Error(`RPC call ${method} timed out`));
			}, 5000);
		});
	}

	public async fetchState(): Promise<void> {
		try {
			const activeSlots = Object.values(this.slot).filter((s): s is number => s !== null);

			for (const slot of activeSlots) {
				// Convert 1-based slot to 0-based Shelly ID
				const shellyId = slot - 1;
				const status = await this.callRpc<SwitchStatus>('Switch.GetStatus', { id: shellyId });
				this.state.set(slot, Boolean(status.output));
			}
		} catch (error) {
			log(`Failed to fetch outlet state: ${stringifyError(error)}`, LogType.Error);
			throw error;
		}
	}

	public async initialize(): Promise<void> {
		this.slot.Light = configManager.getValue(dbConfigVariable.outletSlotLight);
		this.slot.Ventilator = configManager.getValue(dbConfigVariable.outletSlotVentilator);
		this.slot.Humidifier = configManager.getValue(dbConfigVariable.outletSlotHumidifier);
		this.slot.Fan = configManager.getValue(dbConfigVariable.outletSlotFan);

		try {
			await this.fetchState();
		} catch (error) {
			log(`Initial outlet connection failed: ${stringifyError(error)}`, LogType.Warning);
		}
	}

	public isEnabled(socket: number | null): boolean {
		assert(socket !== null, 'Socket is not set');
		return Boolean(this.state.get(socket));
	}

	public async setState(socket: number | null, newState: boolean): Promise<boolean> {
		assert(socket !== null, 'Socket is not set');

		try {
			const shellyId = socket - 1;
			await this.callRpc<unknown>('Switch.Set', { id: shellyId, on: newState });
			this.state.set(socket, newState);
			return newState;
		} catch (error) {
			log(`Outlet switch error: ${stringifyError(error)}`, LogType.Error);
			throw error;
		}
	}
}
