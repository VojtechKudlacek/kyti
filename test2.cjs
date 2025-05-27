const { spawnSync } = require('node:child_process');

function setGpio(pin, value) {
	const result = spawnSync('gpioset', ['gpiochip0', `${pin}=${value}`], { encoding: 'utf-8' });
	if (result.error) {
		console.error('Error executing gpioget:', result.error);
	} else if (result.status !== 0) {
		console.error('gpioget failed:', result.stderr);
	} else {
		const state = result.stdout.trim();
		console.log(`GPIO 17 state is: ${state}`);
	}
}

async function run() {
	setGpio(17, 0);
	await new Promise((resolve) => setTimeout(resolve, 1000));
	setGpio(17, 1);
}

run();
