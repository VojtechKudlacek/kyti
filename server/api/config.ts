import type { FastifyInstance } from 'fastify';
import { envConfigVariable } from '../classes/EnvManager';
import { configManager, envManager } from '../instances';

interface PostBody {
	value: number | boolean;
	secret: string;
}

export async function configRoutes(fastify: FastifyInstance) {
	fastify.get('/', (_request, _reply) => {
		return configManager.getConfig();
	});

	fastify.post('/:key', (request, reply) => {
		const { key } = request.params as { key: string };
		const { value, secret } = request.body as PostBody;
		if (!configManager.isConfigVariable(key)) {
			return reply.code(400).send({ error: 'Invalid key' });
		}
		if (envManager.getValue(envConfigVariable.adminPassword) !== secret) {
			return reply.code(401).send({ error: 'Unauthorized' });
		}
		configManager.setValue(key, value);
		return reply.code(204).send();
	});
}
