import type { Server, Socket } from 'socket.io';
import type { DatabaseRecord } from '../db/types';

export class SocketManager {
	private io: Server | null = null;

	private register(socket: Socket) {
		socket.on('message', (_data) => {
			// console.log('Received message:', data);
			// socket.emit('message', 'Hello from server');
		});

		socket.on('disconnect', () => {
			// console.log('Client disconnected:', socket.id);
		});
	}

	public initialize(io: Server) {
		this.io = io;
		io.on('connection', (socket) => {
			this.register(socket);
		});
	}

	public emitNewRecord(record: DatabaseRecord) {
		this.io?.emit('newRecord', record);
	}
}
