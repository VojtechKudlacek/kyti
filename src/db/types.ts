export interface Record {
	id: number;
	timestamp: number;
	temperature: number | null;
	humidity: number | null;
	light: boolean;
	fan: boolean;
	humidifier: boolean;
	ventilator: boolean;
}

export type WritableRecord = Omit<Record, 'id' | 'timestamp'>;
