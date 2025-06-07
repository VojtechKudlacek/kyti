import type { ApiConfig } from 'types';

export const configKeyTexts: Record<keyof ApiConfig, string> = {
	TEMPERATURE_MAX: 'Maximal Temperature',
	TEMPERATURE_SUFFICIENT: 'Sufficient Temperature',
	TEMPERATURE_MIN: 'Minimal Temperature',

	HUMIDITY_MAX: 'Maximal Humidity',
	HUMIDITY_SUFFICIENT: 'Sufficient Humidity',
	HUMIDITY_MIN: 'Minimal Humidity',

	GRAPH_TEMPERATURE_MIN: 'Minimal Temperature Graph',
	GRAPH_TEMPERATURE_MAX: 'Maximal Temperature Graph',
	GRAPH_HUMIDITY_MIN: 'Minimal Humidity Graph',
	GRAPH_HUMIDITY_MAX: 'Maximal Humidity Graph',

	OUTLET_SLOT_LIGHT: 'Outlet Slot Light',
	OUTLET_SLOT_VENTILATOR: 'Outlet Slot Ventilator',
	OUTLET_SLOT_HUMIDIFIER: 'Outlet Slot Humidifier',
	OUTLET_SLOT_FAN: 'Outlet Slot Fan',

	TASK_CLIMATE_CONTROL: 'Climate Control Task',
	TASK_CLIMATE_LOG: 'Climate Log Task',
	TASK_LOG_BROOM: 'Log Broom Task',
};
