import type { FastifyInstance } from 'fastify';
import { getRecords } from '../db/actions';
import { stringifyError } from '../utils';

interface QueryParams {
	from?: string;
	to?: string;
}

export async function recordsRoutes(fastify: FastifyInstance) {
	fastify.get('/', (request, reply) => {
		try {
			const { from, to } = request.query as QueryParams;
			const fromNumber = from ? Number(from) : undefined;
			const toNumber = to ? Number(to) : undefined;
			return getRecords(fromNumber, toNumber);
		} catch (error) {
			return reply.code(500).send({ error: stringifyError(error) });
		}
	});
}
