import { jotaiStore } from 'store';
import { changeConfigValueAtom, configAtom } from 'store/config';
import { addLogAtom, fetchLogsAtom } from 'store/logs';
import { addRecordAtom } from 'store/records';
import type { ApiConfig, ApiLog, ApiRecord } from 'types';

let socket: WebSocket | null = null;
let reconnectTimer: number | null = null;

function connect() {
	if (socket) {
		return;
	}

	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	socket = new WebSocket(`${protocol}//${window.location.host}/socket`);

	socket.onopen = () => {
		console.log('Socket connected');
		if (reconnectTimer) {
			clearTimeout(reconnectTimer);
			reconnectTimer = null;
		}
	};

	socket.onclose = () => {
		console.log('Socket disconnected');
		socket = null;
		reconnectTimer = window.setTimeout(connect, 1000);
	};

	socket.onerror = (error) => {
		console.log('Socket error', error);
		socket?.close();
	};

	socket.onmessage = (event) => {
		try {
			const message = JSON.parse(event.data);
			const { type, data } = message;

			switch (type) {
				case 'newRecord':
					jotaiStore.set(addRecordAtom, data as ApiRecord);
					break;
				case 'newLog':
					jotaiStore.set(addLogAtom, data as ApiLog);
					break;
				case 'logsChange':
					jotaiStore.set(fetchLogsAtom);
					break;
				case 'configChange': {
					const { key, value } = data as { key: keyof ApiConfig; value: ApiConfig[keyof ApiConfig] };
					const currentConfig = jotaiStore.get(configAtom);
					if (currentConfig) {
						jotaiStore.set(changeConfigValueAtom, [key, value]);
					}
					break;
				}
				default:
					console.warn('Unknown socket message type', type);
			}
		} catch (error) {
			console.error('Failed to parse socket message', error);
		}
	};
}

connect();

export { socket };
