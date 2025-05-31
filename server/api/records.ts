import type { FastifyInstance } from 'fastify';
import { getRecords } from '../db/actions';

interface GetQueryParams {
	from?: string;
	to?: string;
}

export async function recordsRoutes(fastify: FastifyInstance) {
	fastify.get('/', (request, _reply) => {
		const { from, to } = request.query as GetQueryParams;
		const fromNumber = from ? Number(from) : undefined;
		const toNumber = to ? Number(to) : undefined;
		return getRecords(fromNumber, toNumber);
	});
}
