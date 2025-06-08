import { io } from 'socket.io-client';
import { jotaiStore } from 'store';
import { addLogAtom } from 'store/logs';
import { addRecordAtom } from 'store/records';
import type { ApiLog, ApiRecord } from 'types';
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
	jotaiStore.set(addLogAtom, log);
});
