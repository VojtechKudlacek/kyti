import 'dotenv/config';

export const config = {
	outlet: {
		id: String(process.env.TUYA_OUTLET_DEVICE_ID),
		key: String(process.env.TUYA_OUTLET_DEVICE_KEY),
		slots: {
			light: Number(process.env.OUTLET_SLOT_LIGHT),
			ventilator: Number(process.env.OUTLET_SLOT_VENTILATOR),
			fan: Number(process.env.OUTLET_SLOT_FAN),
			humidifier: Number(process.env.OUTLET_SLOT_HUMIDIFIER),
		},
	},
	dht: {
		version: Number(process.env.DHT_VERSION),
		pin: Number(process.env.DHT_PIN),
	},
	database: {
		name: String(process.env.DB_NAME),
		loggingEnabled: Boolean(Number(process.env.DB_LOGGING_ENABLED)),
	},
	tent: {
		temperatureMin: Number(process.env.TEMPERATURE_MIN),
		temperatureMax: Number(process.env.TEMPERATURE_MAX),
		humidityMin: Number(process.env.HUMIDITY_MIN),
		humidityMax: Number(process.env.HUMIDITY_MAX),
		temperatureRange: Number(process.env.TEMPERATURE_RANGE),
		humidityRange: Number(process.env.HUMIDITY_RANGE),
	},
};
