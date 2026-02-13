import { type SQL, and, asc, gte, lte } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { recordSchema } from '../db/schema';
import { databaseClient } from '../instances';

interface GetQueryParams {
	from?: string;
	to?: string;
}

export async function recordsRoutes(fastify: FastifyInstance) {
	fastify.get('/', (request, _reply) => {
		const { from, to } = request.query as GetQueryParams;
		const conditions: Array<SQL> = [];
		if (from) {
			conditions.push(gte(recordSchema.timestamp, Number(from)));
		}
		if (to) {
			conditions.push(lte(recordSchema.timestamp, Number(to)));
		}
		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
		return databaseClient.db.select().from(recordSchema).where(whereClause).orderBy(asc(recordSchema.timestamp)).all();
	});
}
