import type { WebSocket, WebSocketServer } from 'ws';
import type { LogEntity, RecordEntity } from '../db/types';

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
}
