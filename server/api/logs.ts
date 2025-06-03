import type { FastifyInstance } from 'fastify';
import { getLogs } from '../db/actions';

export async function logsRoutes(fastify: FastifyInstance) {
	fastify.get('/', () => {
		return getLogs();
	});
}
