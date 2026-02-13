import type { InferSelectModel } from 'drizzle-orm';
import type { configSchema, logSchema, recordSchema } from './schema';

export type ConfigEntity = InferSelectModel<typeof configSchema>;
export type RecordEntity = InferSelectModel<typeof recordSchema>;
export type LogEntity = InferSelectModel<typeof logSchema>;
