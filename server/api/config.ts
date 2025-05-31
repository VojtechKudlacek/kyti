import type { FastifyInstance } from 'fastify';
import { envConfigVariable } from '../classes/ConfigManager';
import { configManager } from '../instances';

interface PostBody {
	value: number | boolean;
	secret: string;
}

export async function configRoutes(fastify: FastifyInstance) {
	fastify.get('/', (_request, _reply) => {
		return configManager.getDbConfig();
	});

	fastify.post('/:key', (request, reply) => {
		const { key } = request.params as { key: string };
		const { value, secret } = request.body as PostBody;
		if (!configManager.isDbConfigVariable(key)) {
			return reply.code(400).send({ error: 'Invalid key' });
		}
		if (configManager.getValue(envConfigVariable.adminPassword) !== secret) {
			return reply.code(401).send({ error: 'Unauthorized' });
		}
		configManager.setValue(key, value);
		return 'ok';
	});
}
