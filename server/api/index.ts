import type { FastifyInstance } from 'fastify';
import { climateRoutes } from './climate';
import { logsRoutes } from './logs';
import { recordsRoutes } from './records';

export async function apiRoutes(fastify: FastifyInstance) {
	await fastify.register(climateRoutes, { prefix: '/climate' });
	await fastify.register(logsRoutes, { prefix: '/logs' });
	await fastify.register(recordsRoutes, { prefix: '/records' });
}
