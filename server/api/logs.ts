import type { FastifyInstance } from 'fastify';
import { getLogs } from '../db/actions';

interface GetQueryParams {
	page?: string;
	limit?: string;
}

export async function logsRoutes(fastify: FastifyInstance) {
	fastify.get('/', (request) => {
		const { limit, page } = request.query as GetQueryParams;
		const limitNumber = limit ? Number.parseInt(limit, 10) : 100;
		const pageNumber = page ? Number.parseInt(page, 10) : 0;
		const offset = pageNumber * limitNumber;
		return getLogs(limitNumber, offset);
	});
}
