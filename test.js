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

function read() {
  let minTemp = null;
  let maxTemp = null;
  let minHum = null;
  let maxHum = null;
  let errorCount = 0;

  sensor.read(22, 4, function (err, temperature, humidity) {
		const temp = JSON.parse(JSON.stringify(temperature));
		const hum = JSON.parse(JSON.stringify(humidity));
    console.clear();
    console.log(formatter.format(new Date()));
    if (!err) {
      if (minTemp === null) { minTemp = temp; }
      if (maxTemp === null) { maxTemp = temp; }
      if (maxHum === null) { maxHum = hum; }
      if (minHum === null) { minHum = hum; }
      if (hum > maxHum) { maxHum = hum; }
      if (hum < minHum) { minHum = hum; }
      if (temp > maxTemp) { maxTemp = temp; }
      if (temp < minTemp) { minTemp = temp; }
      console.log(`Temp: ${temp.toFixed(1)} C (min ${minTemp.toFixed(1)} C; max ${maxTemp.toFixed(1)} C)`);
      console.log(`Humidity: ${hum.toFixed(1)}% (min ${minHum.toFixed(1)}%; max ${maxHum.toFixed(1)}%)`);
      console.log(`Error count: ${errorCount}`);
    } else {
      errorCount++;
      console.error('Failed to read sensor data:', err);
      console.error(`Error count: ${errorCount}`);
    }
  });
}

setInterval(read, 3000);