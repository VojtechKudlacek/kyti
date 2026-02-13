
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './server/db/schema.ts',
	out: './server/db/migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: 'kyti.db', // Matches the default database name used in instances.ts/EnvManager
	},
});
