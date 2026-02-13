import 'dotenv/config';

import path from 'node:path';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { WebSocketServer } from 'ws';
import { apiRoutes } from './api';
import { envConfigVariable } from './classes/EnvManager';
import { LogType } from './classes/Logger';
import { setupDatabase } from './db/setup';
import {
	configManager,
	databaseClient,
	envManager,
	fastify,
	logger,
	outlet,
	socketManager,
	taskScheduler,
} from './instances';
import { broomRecords, collectRecords, controlClimate } from './tasks';
import { refreshOutletState } from './tasks/refreshOutletState';
import { terminate } from './terminate';
import { stringifyError } from './utils';

export async function run() {
	try {
		console.clear();
		logger.log('Starting application...');

		// Config and Database
		envManager.initialize();
		databaseClient.initialize(envManager.getValue(envConfigVariable.dbName));
		setupDatabase();
		configManager.initialize();

		// Outlet
		await outlet.initialize();

		// Fastify and Socket.io
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
		fastify.setErrorHandler((error, _request, reply) => {
			logger.log(`Error: ${stringifyError(error)}`, LogType.Error);
			reply.status(500).send({ error });
		});
		await fastify.ready();
		const wss = new WebSocketServer({ server: fastify.server });
		socketManager.initialize(wss);
		await new Promise<void>((resolve) => fastify.server.listen({ port: 80, host: '0.0.0.0' }, resolve));

		// Scheduler
		taskScheduler.addTask('Outlet State Refresher', 20, refreshOutletState);
		taskScheduler.addTask('Climate Controller', 20, controlClimate);
		taskScheduler.addTask('Records Collector', 20, collectRecords);
		taskScheduler.addTask('Records Broomer', 60 * 15, broomRecords);
		taskScheduler.start();

		// Termination handlers
		process.on('SIGINT', () => terminate('SIGINT')); // Ctrl+C
		process.on('SIGTERM', () => terminate('SIGTERM')); // PM2, systemd, docker, kubernetes
		process.on('SIGQUIT', () => terminate('SIGQUIT')); // SIGINT with core dump
		process.on('SIGHUP', () => terminate('SIGHUP')); // Terminal closed, PM2 reload
		process.on('uncaughtException', (error) => terminate(`Uncaught Exception: ${stringifyError(error)}`, 1)); // Handle uncaught errors
		process.on('unhandledRejection', (reason) => terminate(`Unhandled Rejection: ${stringifyError(reason)}`, 1)); // Handle unhandled promise rejections

		logger.log('Application started');
	} catch (error) {
		terminate(`Setup error - ${stringifyError(error)}`, 1);
	}
}

run();
