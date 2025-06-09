import { io } from 'socket.io-client';
import { jotaiStore } from 'store';
import { changeConfigValueAtom, configAtom } from 'store/config';
import { addLogAtom, fetchLogsAtom } from 'store/logs';
import { addRecordAtom } from 'store/records';
import type { ApiConfig, ApiLog, ApiRecord } from 'types';
import { baseUrl } from './common';

export const socket = io(baseUrl);

socket.on('connect_error', (err) => {
	console.log(`Socket connect_error due to ${err.message}`);
});

socket.on('connect', () => {
	console.log('Socket connected', socket.id);
});

socket.on('disconnect', () => {
	console.log('Socket disconnected', socket.id);
});

socket.on('newRecord', (record: ApiRecord) => {
	jotaiStore.set(addRecordAtom, record);
});

socket.on('newLog', (log: ApiLog) => {
	console.log('newLog', log);
	jotaiStore.set(addLogAtom, log);
});

socket.on('logsChange', () => {
	console.log('logsChange');
	jotaiStore.set(fetchLogsAtom);
});

interface ConfigChangeEvent {
	key: keyof ApiConfig;
	value: ApiConfig[keyof ApiConfig];
}

socket.on('configChange', ({ key, value }: ConfigChangeEvent) => {
	console.log('configChange', key, value);
	const currentConfig = jotaiStore.get(configAtom);
	if (!currentConfig) {
		return;
	}
	jotaiStore.set(changeConfigValueAtom, [key, value]);
});
