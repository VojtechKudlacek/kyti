const Gpio = require('pigpio').Gpio;

const relay = new Gpio(17, { mode: Gpio.OUTPUT });

relay.digitalWrite(0); // Turn relay ON (active LOW)

setTimeout(() => {
	relay.digitalWrite(1); // Turn relay OFF
}, 2000);
