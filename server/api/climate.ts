import type { FastifyInstance } from 'fastify';
import { envConfigVariable } from '../classes/EnvManager';
import { LogType, log } from '../db/log';
import { climateObserver, envManager } from '../instances';
import { toFixedTenth } from '../utils';

interface PostBody {
	temperature: number;
	humidity: number;
	token: string;
}

export async function climateRoutes(fastify: FastifyInstance) {
	fastify.post('/', (request, reply) => {
		const { token, temperature, humidity } = request.body as PostBody;
		log(`Received climate data: ${temperature}°C, ${humidity}%`, LogType.Info, false);
		if (envManager.getValue(envConfigVariable.climateControlSecret) !== token) {
			return reply.code(401).send({ error: 'Unauthorized' });
		}
		climateObserver.updateClimateMeasurements(toFixedTenth(temperature), toFixedTenth(humidity));
		return 'ok';
	});
}
