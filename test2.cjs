const { version, Chip, Line } = require('node-libgpiod');

const chip = new Chip(0);
const line = new Line(chip, 17); // led on GPIO17
let count = 10;

console.log(version());
line.requestOutputMode();

const blink = () => {
	if (count) {
		line.setValue(count-- % 2);
		setTimeout(blink, 1000);
	} // else line.release();
	// not needed, libgpiod releases resources on process exit
};

setTimeout(blink, 1000);
