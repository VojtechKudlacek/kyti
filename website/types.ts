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

	HUMIDITY_MIN: number;
	HUMIDITY_MAX: number;

	OUTLET_SLOT_LIGHT: number;
	OUTLET_SLOT_VENTILATOR: number;
	OUTLET_SLOT_FAN: number;
	OUTLET_SLOT_HUMIDIFIER: number;

	TASK_CLIMATE_CONTROL: boolean;
	TASK_CLIMATE_LOG: boolean;
	TASK_LOG_BROOM: boolean;

	GRAPH_TEMPERATURE_MIN: number;
	GRAPH_TEMPERATURE_MAX: number;
	GRAPH_HUMIDITY_MIN: number;
	GRAPH_HUMIDITY_MAX: number;

	LOG_LIFESPAN: number;
	RECORD_LIFESPAN: number;

	LIGHT_TURN_ON_TIME: string;
	LIGHT_TURN_OFF_TIME: string;
	FAN_TURN_ON_TIME: string;
	FAN_TURN_OFF_TIME: string;

	MODE: 'GROW' | 'DRY' | 'OFF';
}
