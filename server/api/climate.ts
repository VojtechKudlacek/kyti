import type { FastifyInstance } from 'fastify';
import { envConfigVariable } from '../classes/ConfigManager';
import { LogType, log } from '../db/log';
import { climateObserver, configManager } from '../instances';
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
			log(`Received climate data: ${temperature}°C, ${humidity}%`, LogType.Info, false);
			if (configManager.getValue(envConfigVariable.climateControlSecret) !== token) {
				return reply.code(401).send({ error: 'Unauthorized' });
			}
			climateObserver.updateClimateMeasurements(temperature, humidity);
			return 'ok';
		} catch (error) {
			return reply.code(500).send({ error: stringifyError(error) });
		}
	});
}
