import type { FastifyInstance } from 'fastify';
import { stringifyError } from '../utils';

// interface GetQueryParams {
// 	page?: string;
// 	limit?: string;
// }

export async function climateRoutes(fastify: FastifyInstance) {
	fastify.post('/', (request, reply) => {
		try {
			console.log(request.body);
			return 'ok';
		} catch (error) {
			return reply.code(500).send({ error: stringifyError(error) });
		}
	});
}
