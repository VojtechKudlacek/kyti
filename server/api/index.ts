import type { FastifyInstance } from 'fastify';
import { logsRoutes } from './logs';
import { recordsRoutes } from './records';

export async function apiRoutes(fastify: FastifyInstance) {
	await fastify.register(recordsRoutes, { prefix: '/records' });
	await fastify.register(logsRoutes, { prefix: '/logs' });
}
