import path from 'node:path';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { Server as SocketIOServer } from 'socket.io';
import { apiRoutes } from './api';
import { log } from './db/log';
import { setupDatabase } from './db/setup';
import { dht, fastify, outlet, scheduler, socketManager } from './instances';
import { broomRecords, collectRecords, controlClimate } from './tasks';
import { terminate } from './terminate';
import { stringifyError } from './utils';

export async function run() {
	try {
		console.clear();
		console.log('Starting application...');

		setupDatabase();

		dht.initialize();

		await outlet.initialize();

		fastify.register(cors);
		fastify.register(apiRoutes, { prefix: '/api' });
		fastify.register(fastifyStatic, {
			root: path.join(process.cwd(), 'dist'),
			prefix: '/',
		});
		fastify.setNotFoundHandler((request, reply) => {
			if (request.raw.url?.startsWith('/api')) {
				reply.status(404).send({ error: 'Not found' });
				return;
			}
			reply.type('text/html').sendFile('index.html');
		});
		await fastify.ready();
		const io = new SocketIOServer(fastify.server, { cors: { origin: '*' } });
		socketManager.initialize(io);
		await new Promise<void>((resolve) => fastify.server.listen(3000, resolve));

		scheduler.addTask('Climate Controller', 1, controlClimate);
		scheduler.addTask('Records Collector', 1, collectRecords);
		scheduler.addTask('Records Broomer', 60, broomRecords);
		scheduler.start();

		process.on('SIGINT', () => terminate('SIGINT')); // Ctrl+C
		process.on('SIGTERM', () => terminate('SIGTERM')); // PM2, systemd, docker, kubernetes
		process.on('SIGQUIT', () => terminate('SIGQUIT')); // SIGINT with core dump
		process.on('SIGHUP', () => terminate('SIGHUP')); // Terminal closed, PM2 reload
		process.on('uncaughtException', (error) => terminate(`Uncaught Exception: ${stringifyError(error)}`, 1)); // Handle uncaught errors
		process.on('unhandledRejection', (reason) => terminate(`Unhandled Rejection: ${stringifyError(reason)}`, 1)); // Handle unhandled promise rejections

		log('Application started');
	} catch (error) {
		terminate(`Setup error - ${stringifyError(error)}`, 1);
	}
}
