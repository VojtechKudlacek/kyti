import assert from 'node:assert/strict';

type EnvConfigVariable = (typeof envConfigVariable)[keyof typeof envConfigVariable];

type ConfigVariableTypeMap = {
	[envConfigVariable.tuyaOutletDeviceId]: string;
	[envConfigVariable.tuyaOutletDeviceKey]: string;
	[envConfigVariable.climateControlSecret]: string;
	[envConfigVariable.adminPassword]: string;
	[envConfigVariable.dbName]: string;
};

export const envConfigVariable = {
	tuyaOutletDeviceId: 'TUYA_OUTLET_DEVICE_ID',
	tuyaOutletDeviceKey: 'TUYA_OUTLET_DEVICE_KEY',
	climateControlSecret: 'CLIMATE_CONTROL_SECRET',
	adminPassword: 'ADMIN_PASSWORD',
	dbName: 'DB_NAME',
} as const;

export const envConfigVariables = Object.values(envConfigVariable);

export class EnvManager {
	private config: Map<EnvConfigVariable, ConfigVariableTypeMap[EnvConfigVariable] | null> = new Map();

	public initialize(): void {
		for (const variable of envConfigVariables) {
			const value = process.env[variable];
			assert(value, `Environment variable ${variable} is not set`);
			this.config.set(variable, value);
		}
	}

	public getValue<K extends EnvConfigVariable>(variable: K): ConfigVariableTypeMap[K] {
		const value = this.config.get(variable);
		return value as ConfigVariableTypeMap[K];
	}
}
