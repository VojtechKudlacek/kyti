import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const recordSchema = sqliteTable('records', {
	timestamp: integer('timestamp').primaryKey(),
	temperature: real('temperature'),
	humidity: real('humidity'),
	light: integer('light', { mode: 'boolean' }).notNull(),
	fan: integer('fan', { mode: 'boolean' }).notNull(),
	humidifier: integer('humidifier', { mode: 'boolean' }).notNull(),
	ventilator: integer('ventilator', { mode: 'boolean' }).notNull(),
});

export const logSchema = sqliteTable('logs', {
	timestamp: integer('timestamp').primaryKey(),
	type: text('type').notNull(),
	message: text('message').notNull(),
});

export const configSchema = sqliteTable('config', {
	key: text('key').primaryKey(),
	value: text('value').notNull(),
});
