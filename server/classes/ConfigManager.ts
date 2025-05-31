import { getConfig, updateConfig } from '../db/actions';

type ConfigVariable = (typeof dbConfigVariable)[keyof typeof dbConfigVariable];

type DbConfig = Record<ConfigVariable, ConfigVariableTypeMap[ConfigVariable] | null>;

type ConfigVariableTypeMap = {
	[dbConfigVariable.temperatureMin]: number;
	[dbConfigVariable.temperatureMax]: number;
	[dbConfigVariable.temperatureSufficient]: number;

	[dbConfigVariable.humidityMin]: number;
	[dbConfigVariable.humidityMax]: number;
	[dbConfigVariable.humiditySufficient]: number;

	[dbConfigVariable.outletSlotLight]: number;
	[dbConfigVariable.outletSlotVentilator]: number;
	[dbConfigVariable.outletSlotFan]: number;
	[dbConfigVariable.outletSlotHumidifier]: number;

	[dbConfigVariable.taskClimateControl]: boolean;
	[dbConfigVariable.taskClimateLog]: boolean;
	[dbConfigVariable.taskLogBroom]: boolean;

	[dbConfigVariable.graphTemperatureMin]: number;
	[dbConfigVariable.graphTemperatureMax]: number;
	[dbConfigVariable.graphHumidityMin]: number;
	[dbConfigVariable.graphHumidityMax]: number;
};

export const dbConfigVariable = {
	temperatureMin: 'TEMPERATURE_MIN',
	temperatureMax: 'TEMPERATURE_MAX',
	temperatureSufficient: 'TEMPERATURE_SUFFICIENT',

	humidityMin: 'HUMIDITY_MIN',
	humidityMax: 'HUMIDITY_MAX',
	humiditySufficient: 'HUMIDITY_SUFFICIENT',

	outletSlotLight: 'OUTLET_SLOT_LIGHT',
	outletSlotVentilator: 'OUTLET_SLOT_VENTILATOR',
	outletSlotFan: 'OUTLET_SLOT_FAN',
	outletSlotHumidifier: 'OUTLET_SLOT_HUMIDIFIER',

	taskClimateControl: 'TASK_CLIMATE_CONTROL',
	taskClimateLog: 'TASK_CLIMATE_LOG',
	taskLogBroom: 'TASK_LOG_BROOM',

	graphTemperatureMin: 'GRAPH_TEMPERATURE_MIN',
	graphTemperatureMax: 'GRAPH_TEMPERATURE_MAX',
	graphHumidityMin: 'GRAPH_HUMIDITY_MIN',
	graphHumidityMax: 'GRAPH_HUMIDITY_MAX',
} as const;

export const dbConfigVariables = Object.values(dbConfigVariable);

export class ConfigManager {
	private config: Map<ConfigVariable, ConfigVariableTypeMap[ConfigVariable] | null> = new Map();

	public isConfigVariable(variable: string): variable is ConfigVariable {
		return dbConfigVariables.includes(variable as ConfigVariable);
	}

	public initialize(): void {
		const dbConfig = getConfig();
		for (const config of dbConfig) {
			if (this.isConfigVariable(config.key)) {
				this.config.set(config.key, JSON.parse(config.value));
			}
		}
	}

	public getValue<K extends ConfigVariable>(variable: K): ConfigVariableTypeMap[K] | null {
		const value = this.config.get(variable);
		return value as ConfigVariableTypeMap[K] | null;
	}

	public setValue<K extends ConfigVariable>(variable: K, value: ConfigVariableTypeMap[K]) {
		this.config.set(variable, value);
		updateConfig(variable, JSON.stringify(value));
	}

	public getConfig(): DbConfig {
		return Object.fromEntries(dbConfigVariables.map((variable) => [variable, this.getValue(variable)])) as DbConfig;
	}
}
