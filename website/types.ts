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
