import { getConfig, updateConfig } from '../db/actions';

type ConfigVariable = (typeof dbConfigVariable)[keyof typeof dbConfigVariable];

type DbConfig = Record<ConfigVariable, ConfigVariableTypeMap[ConfigVariable]>;

type ConfigVariableTypeMap = {
	[dbConfigVariable.temperatureMin]: number;
	[dbConfigVariable.temperatureMax]: number;

	[dbConfigVariable.humidityMin]: number;
	[dbConfigVariable.humidityMax]: number;

	[dbConfigVariable.outletSlotLight]: 1 | 2 | 3 | 4;
	[dbConfigVariable.outletSlotVentilator]: 1 | 2 | 3 | 4;
	[dbConfigVariable.outletSlotFan]: 1 | 2 | 3 | 4;
	[dbConfigVariable.outletSlotHumidifier]: 1 | 2 | 3 | 4;

	[dbConfigVariable.taskClimateLog]: boolean;
	[dbConfigVariable.taskLogBroom]: boolean;

	[dbConfigVariable.graphTemperatureMin]: number;
	[dbConfigVariable.graphTemperatureMax]: number;
	[dbConfigVariable.graphHumidityMin]: number;
	[dbConfigVariable.graphHumidityMax]: number;

	[dbConfigVariable.logLifespan]: number;
	[dbConfigVariable.recordLifespan]: number;

	[dbConfigVariable.lightTurnOnTime]: `${string}:${string}`;
	[dbConfigVariable.lightTurnOffTime]: `${string}:${string}`;
	[dbConfigVariable.fanTurnOnTime]: `${string}:${string}`;
	[dbConfigVariable.fanTurnOffTime]: `${string}:${string}`;

	[dbConfigVariable.mode]: 'GROW' | 'DRY' | 'OFF';
};

export const dbConfigVariable = {
	temperatureMin: 'TEMPERATURE_MIN',
	temperatureMax: 'TEMPERATURE_MAX',

	humidityMin: 'HUMIDITY_MIN',
	humidityMax: 'HUMIDITY_MAX',

	outletSlotLight: 'OUTLET_SLOT_LIGHT',
	outletSlotVentilator: 'OUTLET_SLOT_VENTILATOR',
	outletSlotFan: 'OUTLET_SLOT_FAN',
	outletSlotHumidifier: 'OUTLET_SLOT_HUMIDIFIER',

	taskClimateLog: 'TASK_CLIMATE_LOG',
	taskLogBroom: 'TASK_LOG_BROOM',

	graphTemperatureMin: 'GRAPH_TEMPERATURE_MIN',
	graphTemperatureMax: 'GRAPH_TEMPERATURE_MAX',
	graphHumidityMin: 'GRAPH_HUMIDITY_MIN',
	graphHumidityMax: 'GRAPH_HUMIDITY_MAX',

	logLifespan: 'LOG_LIFESPAN',
	recordLifespan: 'RECORD_LIFESPAN',

	lightTurnOnTime: 'LIGHT_TURN_ON_TIME',
	lightTurnOffTime: 'LIGHT_TURN_OFF_TIME',
	fanTurnOnTime: 'FAN_TURN_ON_TIME',
	fanTurnOffTime: 'FAN_TURN_OFF_TIME',

	mode: 'MODE',
} as const;

export const defaultDbConfigValues: DbConfig = {
	[dbConfigVariable.temperatureMin]: 20,
	[dbConfigVariable.temperatureMax]: 30,

	[dbConfigVariable.humidityMin]: 40,
	[dbConfigVariable.humidityMax]: 60,

	[dbConfigVariable.outletSlotLight]: 1,
	[dbConfigVariable.outletSlotVentilator]: 2,
	[dbConfigVariable.outletSlotFan]: 3,
	[dbConfigVariable.outletSlotHumidifier]: 4,

	[dbConfigVariable.taskClimateLog]: true,
	[dbConfigVariable.taskLogBroom]: true,

	[dbConfigVariable.graphTemperatureMin]: 20,
	[dbConfigVariable.graphTemperatureMax]: 30,
	[dbConfigVariable.graphHumidityMin]: 40,
	[dbConfigVariable.graphHumidityMax]: 60,

	[dbConfigVariable.logLifespan]: 72,
	[dbConfigVariable.recordLifespan]: 72,

	[dbConfigVariable.lightTurnOnTime]: '07:00',
	[dbConfigVariable.lightTurnOffTime]: '23:00',
	[dbConfigVariable.fanTurnOnTime]: '07:10',
	[dbConfigVariable.fanTurnOffTime]: '23:10',

	[dbConfigVariable.mode]: 'OFF',
};

export const dbConfigVariables = Object.values(dbConfigVariable);

export class ConfigManager {
	private config: Map<ConfigVariable, ConfigVariableTypeMap[ConfigVariable]> = new Map();

	public isConfigVariable(variable: string): variable is ConfigVariable {
		return dbConfigVariables.includes(variable as ConfigVariable);
	}

	public initialize(): void {
		const dbConfig = getConfig();
		for (const config of dbConfig) {
			if (this.isConfigVariable(config.key)) {
				this.config.set(config.key, JSON.parse(config.value) ?? defaultDbConfigValues[config.key]);
			}
		}
	}

	public getValue<K extends ConfigVariable>(variable: K): ConfigVariableTypeMap[K] {
		const value = this.config.get(variable);
		return value as ConfigVariableTypeMap[K];
	}

	public setValue<K extends ConfigVariable>(variable: K, value: ConfigVariableTypeMap[K]) {
		this.config.set(variable, value);
		updateConfig(variable, JSON.stringify(value));
	}

	public getConfig(): DbConfig {
		return Object.fromEntries(dbConfigVariables.map((variable) => [variable, this.getValue(variable)])) as DbConfig;
	}
}
