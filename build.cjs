const esbuild = require('esbuild');

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} mb`;
  } else if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} kb`;
  }
  return `${bytes} B`;
}

console.time('build');
esbuild.build({
  entryPoints: ['server/app.ts'],
  bundle: true,
  outfile: 'server.cjs',
  platform: 'node',
  target: 'node24',
  format: 'cjs',
  sourcemap: false,
  minify: false,
	metafile: true,
	tsconfig: 'tsconfig.server.json',
  external: [
		'@fastify/cors',
		'@fastify/static',
		'better-sqlite3',
		'date-fns',
		'dotenv',
		'fastify',
		'tuyapi',
		'ws',
  ]
}).then((result) => {
	for (const output in result.metafile.outputs) {
		console.log(`${output} [${formatSize(result.metafile.outputs[output].bytes)}]`);
	}
	console.timeEnd('build');
}).catch(() => process.exit(1));
