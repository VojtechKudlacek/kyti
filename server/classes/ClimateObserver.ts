interface ClimateData {
	temperature: number | null;
	humidity: number | null;
}

const maxAgeInMiliseconds = 120_000; // 2 minutes

export class ClimateObserver {
	private temperature: number | null = null;
	private humidity: number | null = null;

	private lastUpdate: number | null = null;

	private validateData() {
		const now = Date.now();
		if (this.lastUpdate && now > this.lastUpdate + maxAgeInMiliseconds) {
			this.temperature = null;
			this.humidity = null;
		}
	}

	public updateClimateMeasurements(temperature: number, humidity: number) {
		this.temperature = temperature;
		this.humidity = humidity;
		this.lastUpdate = Date.now();
	}

	public getCurrentClimateData(): ClimateData {
		this.validateData();
		return { temperature: this.temperature, humidity: this.humidity };
	}
}
