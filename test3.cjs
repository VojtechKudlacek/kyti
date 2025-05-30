const BME280 = require('bme280-sensor');

const options = {
	i2cBusNo: 1, // Typically 1 for Raspberry Pi
	i2cAddress: 0x76, // Try 0x77 if 0x76 doesn't work
};

const sensor = new BME280(options);

sensor
	.init()
	.then(() => {
		console.log('BME280 initialization succeeded');
		return sensor.readSensorData();
	})
	.then((data) => {
		console.log(`Temperature: ${data.temperature_C.toFixed(2)} °C`);
		console.log(`Humidity: ${data.humidity.toFixed(2)} %`);
		console.log(`Pressure: ${data.pressure_hPa.toFixed(2)} hPa`);
	})
	.catch((err) => {
		console.error('BME280 initialization failed:', err);
	});
