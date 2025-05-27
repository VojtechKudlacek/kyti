const { Gpio } = require('onoff');

// Replace 17 with your actual GPIO pin number
const relay = new Gpio(17, 'out');

// Turn relay ON (usually LOW)
relay.writeSync(0); // Active LOW

setTimeout(() => {
	// Turn relay OFF (usually HIGH)
	relay.writeSync(1);

	// Cleanup
	relay.unexport();
}, 2000);
