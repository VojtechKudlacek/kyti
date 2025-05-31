import assert from 'node:assert/strict';
import { getConfig, updateConfig } from '../db/actions';

type DbConfigVariable = (typeof dbConfigVariable)[keyof typeof dbConfigVariable];
type EnvConfigVariable = (typeof envConfigVariable)[keyof typeof envConfigVariable];
type ConfigVariable = DbConfigVariable | EnvConfigVariable;

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

	[envConfigVariable.tuyaOutletDeviceId]: string;
	[envConfigVariable.tuyaOutletDeviceKey]: string;
	[envConfigVariable.climateControlSecret]: string;
	[envConfigVariable.adminPassword]: string;
	[envConfigVariable.dbName]: string;
};

type GetValueReturnType<K extends ConfigVariable> = K extends DbConfigVariable
	? ConfigVariableTypeMap[K] | null
	: ConfigVariableTypeMap[K];

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
} as const;

export const envConfigVariable = {
	tuyaOutletDeviceId: 'TUYA_OUTLET_DEVICE_ID',
	tuyaOutletDeviceKey: 'TUYA_OUTLET_DEVICE_KEY',
	climateControlSecret: 'CLIMATE_CONTROL_SECRET',
	adminPassword: 'ADMIN_PASSWORD',
	dbName: 'DB_NAME',
} as const;

export const dbConfigVariables = Object.values(dbConfigVariable);
export const envConfigVariables = Object.values(envConfigVariable);

export class ConfigManager {
	private config: Map<ConfigVariable, ConfigVariableTypeMap[ConfigVariable] | null> = new Map();

	private isDbConfigVariable(variable: string): variable is DbConfigVariable {
		return dbConfigVariables.includes(variable as DbConfigVariable);
	}

	public initializeEnvConfig(): void {
		for (const variable of envConfigVariables) {
			const value = process.env[variable];
			assert(value, `Environment variable ${variable} is not set`);
			this.config.set(variable, value);
		}
	}

	public initializeDbConfig(): void {
		const dbConfig = getConfig();
		for (const config of dbConfig) {
			if (this.isDbConfigVariable(config.key)) {
				this.config.set(config.key, JSON.parse(config.value));
			}
		}
	}

	public getValue<K extends ConfigVariable>(variable: K): GetValueReturnType<K> {
		const value = this.config.get(variable);
		return value as GetValueReturnType<K>;
	}

	public setValue<K extends ConfigVariable>(variable: K, value: ConfigVariableTypeMap[K]) {
		this.config.set(variable, value);
		updateConfig(variable, JSON.stringify(value));
	}
}
