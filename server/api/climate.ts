import type { FastifyInstance } from 'fastify';
import { config } from '../config';
import { climateObserver } from '../instances';
import { stringifyError } from '../utils';

interface PostBody {
	temperature: number;
	humidity: number;
	token: string;
}

export async function climateRoutes(fastify: FastifyInstance) {
	fastify.post('/', (request, reply) => {
		try {
			const { token, temperature, humidity } = request.body as PostBody;
			if (config.climateControlSecret !== token) {
				return reply.code(401).send({ error: 'Unauthorized' });
			}
			climateObserver.updateClimateMeasurements(temperature, humidity);
			return 'ok';
		} catch (error) {
			return reply.code(500).send({ error: stringifyError(error) });
		}
	});
}
