import { addMinutes, differenceInMinutes, startOfHour, startOfMinute } from 'date-fns';
import { LogType, log } from '../db/log';
import { stringifyError } from '../utils';

interface Task {
	name: string;
	intervalMinutes: number;
	nextRunMinutes: number;
	fn: () => void | Promise<void>;
}

export class Scheduler {
	private tasks: Array<Task> = [];
	private interval: NodeJS.Timeout | null = null;

	private get nowMinutes(): number {
		return Math.floor(Date.now() / 60_000);
	}

	private calculateFirstRunTime(intervalMinutes: number): number {
		const now = new Date();
		const start = startOfHour(now);
		const minutesSinceStart = differenceInMinutes(now, start);
		const minutesUntilNextRun = intervalMinutes - (minutesSinceStart % intervalMinutes);
		const nextRun = addMinutes(startOfMinute(now), minutesUntilNextRun);
		return nextRun.getTime() / 60_000;
	}

	public addTask(name: string, intervalMinutes: number, fn: () => void | Promise<void>): void {
		const nextRunMinutes = this.calculateFirstRunTime(intervalMinutes);
		this.tasks.push({ name, intervalMinutes, nextRunMinutes, fn });
	}

	public start(): void {
		if (this.interval) {
			return;
		}

		this.interval = setInterval(async () => {
			const nowMinutes = this.nowMinutes;
			for (const task of this.tasks) {
				if (nowMinutes >= task.nextRunMinutes) {
					try {
						await task.fn();
						task.nextRunMinutes += task.intervalMinutes;
					} catch (error) {
						log(`Error executing task [${task.name}]: ${stringifyError(error)}`, LogType.Error);
					}
				}
			}
		}, 1000);
	}

	public stop(): void {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	}
}
