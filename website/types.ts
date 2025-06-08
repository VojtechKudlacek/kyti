export interface ApiRecord {
	timestamp: number;
	temperature: number | null;
	humidity: number | null;
	light: boolean;
	fan: boolean;
	humidifier: boolean;
	ventilator: boolean;
}

export interface ApiLog {
	timestamp: number;
	type: 'INFO' | 'WARNING' | 'ERROR';
	message: string;
}

export interface ApiConfig {
	TEMPERATURE_MIN: number;
	TEMPERATURE_MAX: number;
	TEMPERATURE_SUFFICIENT: number;

	HUMIDITY_MIN: number;
	HUMIDITY_MAX: number;
	HUMIDITY_SUFFICIENT: number;

	OUTLET_SLOT_LIGHT: 1 | 2 | 3 | 4;
	OUTLET_SLOT_VENTILATOR: 1 | 2 | 3 | 4;
	OUTLET_SLOT_FAN: 1 | 2 | 3 | 4;
	OUTLET_SLOT_HUMIDIFIER: 1 | 2 | 3 | 4;

	TASK_CLIMATE_CONTROL: boolean;
	TASK_CLIMATE_LOG: boolean;
	TASK_LOG_BROOM: boolean;
	TASK_SWITCH_DEVICES: boolean;

	GRAPH_TEMPERATURE_MIN: number;
	GRAPH_TEMPERATURE_MAX: number;
	GRAPH_HUMIDITY_MIN: number;
	GRAPH_HUMIDITY_MAX: number;

	LOG_LIFESPAN: number;
	RECORD_LIFESPAN: number;

	LIGHT_TURN_ON_TIME: `${string}:${string}`;
	LIGHT_TURN_OFF_TIME: `${string}:${string}`;
	FAN_TURN_ON_TIME: `${string}:${string}`;
	FAN_TURN_OFF_TIME: `${string}:${string}`;
}
