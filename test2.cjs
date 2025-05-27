const fs = require('node:fs');
const Epoll = require('epoll').Epoll;

const gpioPin = 17; // GPIO pin number

// Export the GPIO pin
try {
	fs.writeFileSync('/sys/class/gpio/export', gpioPin.toString());
} catch (err) {
	if (!err.message.includes('Device or resource busy')) {
		throw err;
	}
}

// Set direction to input
fs.writeFileSync(`/sys/class/gpio/gpio${gpioPin}/direction`, 'in');

// Set edge to rising or falling or both
fs.writeFileSync(`/sys/class/gpio/gpio${gpioPin}/edge`, 'both');

// Open value file descriptor
const fd = fs.openSync(`/sys/class/gpio/gpio${gpioPin}/value`, 'r');

// Create a buffer to read value
const buffer = Buffer.alloc(1);

// Read initial value to clear any prior state
fs.readSync(fd, buffer, 0, 1, 0);

const epoll = new Epoll((err, fd) => {
	if (err) {
		throw err;
	}

	// Read the GPIO value on interrupt
	fs.readSync(fd, buffer, 0, 1, 0);

	const value = buffer.toString() === '1' ? 1 : 0;
	console.log(`GPIO${gpioPin} value changed to: ${value}`);
});

// Start watching for EPOLLPRI (urgent data, i.e., GPIO interrupt)
epoll.add(fd, Epoll.EPOLLPRI);

// Keep the program running
console.log(`Watching GPIO${gpioPin} for changes. Press Ctrl+C to exit.`);

// Cleanup function on exit
process.on('SIGINT', () => {
	epoll.remove(fd).close();
	fs.closeSync(fd);
	fs.writeFileSync('/sys/class/gpio/unexport', gpioPin.toString());
	console.log('Exiting...');
	process.exit();
});
