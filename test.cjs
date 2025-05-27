const sensor = require('node-dht-sensor');

const formatter = new Intl.DateTimeFormat('cs-CZ', {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	hour12: false,
});

let minTemperature = null;
let maxTemperature = null;
let minHumidity = null;
let maxHumidity = null;
let errorCount = 0;

function read() {
	sensor.read(22, 4, function (err, temperature, humidity) {
		console.clear();
		console.log(`Now: ${formatter.format(new Date())}`);
		console.log(`Uptime: ${process.uptime().toFixed(1)}s`);

		if (err) {
			errorCount++;
			console.error('Failed to read sensor data:', err);
			console.error(`Error count: ${errorCount}`);
		}

		if (minTemperature === null) {
			minTemperature = temperature;
		}
		if (maxTemperature === null) {
			maxTemperature = temperature;
		}
		if (maxHumidity === null) {
			maxHumidity = humidity;
		}
		if (minHumidity === null) {
			minHumidity = humidity;
		}
		if (humidity > maxHumidity) {
			maxHumidity = humidity;
		}
		if (humidity < minHumidity) {
			minHumidity = humidity;
		}
		if (temperature > maxTemperature) {
			maxTemperature = temperature;
		}
		if (temperature < minTemperature) {
			minTemperature = temperature;
		}

		console.log(
			`Temp: ${temperature.toFixed(1)} C (min ${minTemperature.toFixed(1)} C; max ${maxTemperature.toFixed(1)} C)`,
		);
		console.log(`Humidity: ${humidity.toFixed(1)}% (min ${minHumidity.toFixed(1)}%; max ${maxHumidity.toFixed(1)}%)`);
		console.log(`Error count: ${errorCount}`);
		return;
	});
}

setInterval(read, 3000);
