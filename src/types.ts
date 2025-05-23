export interface Flower {
	id: number;
	name: string;
	minTemperature: number;
	maxTemperature: number;
	minHumidity: number;
	maxHumidity: number;
	enabled: boolean;
}

export enum SensorType {
	Soil = 'SOIL',
	Humidity = 'HUMIDITY',
}

export interface Sensor {
	id: number;
	pin: number;
	flower_id: number | null;
	type: SensorType;
}
