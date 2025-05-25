import type { FastifyInstance } from 'fastify';
import { getRecords } from '../db/actions';
import { stringifyError } from '../utils';

export async function recordsRoutes(fastify: FastifyInstance) {
	fastify.get('/', (_request, reply) => {
		try {
			return getRecords();
		} catch (error) {
			return reply.code(500).send({ error: stringifyError(error) });
		}
	});
}
