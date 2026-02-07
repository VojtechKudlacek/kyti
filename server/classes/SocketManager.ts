import type { WebSocket, WebSocketServer } from 'ws';
import type { LogEntity, RecordEntity } from '../db/types';
import { outlet } from '../instances';
import type { OutletStatus } from './Outlet';

export class SocketManager {
	private clients: Set<WebSocket> = new Set();

	private register(ws: WebSocket) {
		this.clients.add(ws);

		ws.on('close', () => {
			this.clients.delete(ws);
		});
	}

	public initialize(wss: WebSocketServer) {
		wss.on('connection', (ws) => {
			this.register(ws);

			// Send initial state to new client
			ws.send(JSON.stringify({ type: 'outletState', data: outlet.getAllStates() }));

			ws.on('message', (message) => {
				try {
					const parsed = JSON.parse(message.toString());
					if (parsed.type === 'setOutletState') {
						const { slot, state } = parsed.data;
						outlet.setState(slot, state);
					}
				} catch (_error) {
					// Ignore malformed messages
				}
			});
		});
	}

	private broadcast(type: string, data?: unknown) {
		const message = JSON.stringify({ type, data });
		for (const client of this.clients) {
			if (client.readyState === 1) {
				// WebSocket.OPEN
				client.send(message);
			}
		}
	}

	public emitNewRecord(record: RecordEntity) {
		this.broadcast('newRecord', record);
	}

	public emitNewLog(log: LogEntity) {
		this.broadcast('newLog', log);
	}

	public emitLogsChange() {
		this.broadcast('logsChange');
	}

	public emitConfigChange(key: string, value: unknown) {
		this.broadcast('configChange', { key, value });
	}

	public emitOutletState(state: Record<number, OutletStatus>) {
		this.broadcast('outletState', state);
	}
}
