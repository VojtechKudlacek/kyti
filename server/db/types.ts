export interface ConfigEntity {
	key: string;
	value: string;
}

export interface RecordEntity {
	timestamp: number;
	temperature: number | null;
	humidity: number | null;
	light: boolean;
	fan: boolean;
	humidifier: boolean;
	ventilator: boolean;
}

export interface LogEntity {
	timestamp: number;
	type: 'INFO' | 'WARNING' | 'ERROR';
	message: string;
}
