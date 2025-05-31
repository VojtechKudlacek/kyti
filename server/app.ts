import 'dotenv/config';

import path from 'node:path';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { Server as SocketIOServer } from 'socket.io';
import { apiRoutes } from './api';
import { envConfigVariable } from './classes/EnvManager';
import { LogType, log } from './db/log';
import { setupDatabase } from './db/setup';
import { configManager, databaseClient, envManager, fastify, outlet, scheduler, socketManager } from './instances';
import { broomRecords, collectRecords, controlClimate } from './tasks';
import { refreshOutletState } from './tasks/refreshOutletState';
import { terminate } from './terminate';
import { stringifyError } from './utils';

export async function run() {
	try {
		console.clear();
		log('Starting application...', LogType.Info, false);

		// Config and Database
		envManager.initialize();
		databaseClient.initialize(envManager.getValue(envConfigVariable.dbName));
		setupDatabase();
		configManager.initialize();

		// Outlet
		await outlet.initialize();

		// Fastify and Socket.io
		fastify.register(cors);
		fastify.addContentTypeParser(
			'application/json',
			{ parseAs: 'string' },
			fastify.getDefaultJsonParser('error', 'error'),
		);
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
		fastify.setErrorHandler((error, _request, reply) => {
			log(`Error: ${stringifyError(error)}`, LogType.Error, false);
			reply.status(500).send({ error });
		});
		await fastify.ready();
		const io = new SocketIOServer(fastify.server, { cors: { origin: '*' } });
		socketManager.initialize(io);
		await new Promise<void>((resolve) => fastify.server.listen(3000, resolve));

		// Scheduler
		scheduler.addTask('Outlet State Refresher', 1, refreshOutletState);
		scheduler.addTask('Climate Controller', 1, controlClimate);
		scheduler.addTask('Records Collector', 1, collectRecords);
		scheduler.addTask('Records Broomer', 60, broomRecords);
		scheduler.start();

		// Termination handlers
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

run();
