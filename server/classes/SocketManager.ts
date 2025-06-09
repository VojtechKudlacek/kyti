import type { Server, Socket } from 'socket.io';
import type { LogEntity, RecordEntity } from '../db/types';

export class SocketManager {
	private io: Server | null = null;
	private clients: Map<string, Socket> = new Map();

	private register(socket: Socket) {
		this.clients.set(socket.id, socket);

		socket.on('disconnect', () => {
			this.clients.delete(socket.id);
		});
	}

	public initialize(io: Server) {
		this.io = io;
		io.on('connection', (socket) => {
			this.register(socket);
		});
	}

	public emitNewRecord(record: RecordEntity) {
		this.io?.emit('newRecord', record);
	}

	public emitNewLog(log: LogEntity) {
		this.io?.emit('newLog', log);
	}

	public emitLogsChange() {
		this.io?.emit('logsChange');
	}

	public emitConfigChange(key: string, value: unknown) {
		this.io?.emit('configChange', { key, value });
	}
}
