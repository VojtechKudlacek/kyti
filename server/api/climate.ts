import type { FastifyInstance } from 'fastify';
import { envConfigVariable } from '../classes/EnvManager';
import { climateObserver, envManager, logger } from '../instances';
import { toFixedTenth } from '../utils';

interface PostBody {
	temperature: number;
	humidity: number;
	token: string;
}

export async function climateRoutes(fastify: FastifyInstance) {
	fastify.post('/', (request, reply) => {
		const { token, temperature, humidity } = request.body as PostBody;
		logger.log(`Received climate data: ${temperature}°C, ${humidity}%`);
		if (envManager.getValue(envConfigVariable.climateControlSecret) !== token) {
			return reply.code(401).send({ error: 'Unauthorized' });
		}
		climateObserver.updateClimateMeasurements(toFixedTenth(temperature), toFixedTenth(humidity));
		return reply.code(204).send();
	});
}
