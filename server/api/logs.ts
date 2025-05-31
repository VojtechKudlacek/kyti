import type { FastifyInstance } from 'fastify';
import { getLogs } from '../db/actions';
import { stringifyError } from '../utils';

interface GetQueryParams {
	page?: string;
	limit?: string;
}

export async function logsRoutes(fastify: FastifyInstance) {
	fastify.get('/', (request, reply) => {
		try {
			const { limit, page } = request.query as GetQueryParams;
			const limitNumber = limit ? Number.parseInt(limit, 10) : 100;
			const pageNumber = page ? Number.parseInt(page, 10) : 0;
			const offset = pageNumber * limitNumber;
			return getLogs(limitNumber, offset);
		} catch (error) {
			return reply.code(500).send({ error: stringifyError(error) });
		}
	});
}
