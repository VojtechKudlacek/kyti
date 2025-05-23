import 'dotenv/config';

export const config = {
	deviceId: String(process.env.TUYA_DEVICE_ID),
	deviceKey: String(process.env.TUYA_DEVICE_KEY),
	databaseName: String(process.env.DB_NAME),
};

export const outlets = {
	light: 1,
	ventilator: 2,
	fan: 3,
	humidifier: 4,
};
