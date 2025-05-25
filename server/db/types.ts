export interface DatabaseRecord {
	id: number;
	timestamp: number;
	temperature: number | null;
	humidity: number | null;
	light: boolean;
	fan: boolean;
	humidifier: boolean;
	ventilator: boolean;
}

export type WritableDatabseRecord = Omit<DatabaseRecord, 'id'>;

export interface DatabaseLog {
	id: number;
	timestamp: number;
	type: 'INFO' | 'WARNING' | 'ERROR';
	message: string;
}

export type WritableDatabaseLog = Omit<DatabaseLog, 'id'>;
