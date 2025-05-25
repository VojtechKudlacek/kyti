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
			const limitNumber = limit ? Number(limit) : undefined;
			const pageNumber = page ? Number(page) : undefined;
			return getLogs(limitNumber, pageNumber);
		} catch (error) {
			return reply.code(500).send({ error: stringifyError(error) });
		}
	});
}
