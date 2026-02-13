import { desc } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { logSchema } from '../db/schema';
import { databaseClient } from '../instances';

export async function logsRoutes(fastify: FastifyInstance) {
	fastify.get('/', () => {
		return databaseClient.db.select().from(logSchema).orderBy(desc(logSchema.timestamp)).all();
	});
}
