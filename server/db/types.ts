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
