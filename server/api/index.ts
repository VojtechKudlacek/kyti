import type { FastifyInstance } from 'fastify';
import { recordsRoutes } from './records';

export async function apiRoutes(fastify: FastifyInstance) {
	await fastify.register(recordsRoutes, { prefix: '/records' });
}
