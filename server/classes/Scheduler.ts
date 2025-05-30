import { addMinutes, differenceInMinutes, startOfHour, startOfMinute } from 'date-fns';
import { LogType, log } from '../db/log';
import { stringifyError } from '../utils';

type TaskFn = (timestamp: number) => void | Promise<void>;

interface Task {
	name: string;
	intervalMinutes: number;
	nextRunMinutes: number;
	fn: TaskFn;
}

export class Scheduler {
	private tasks: Array<Task> = [];
	private interval: NodeJS.Timeout | null = null;

	private calculateFirstRunTime(intervalMinutes: number): number {
		const now = new Date();
		const start = startOfHour(now);
		const minutesSinceStart = differenceInMinutes(now, start);
		const minutesUntilNextRun = intervalMinutes - (minutesSinceStart % intervalMinutes);
		const nextRun = addMinutes(startOfMinute(now), minutesUntilNextRun);
		return nextRun.getTime() / 60_000;
	}

	public addTask(name: string, intervalMinutes: number, fn: TaskFn): void {
		if (![1, 2, 3, 4, 5, 6, 10, 15, 20, 30, 60].includes(intervalMinutes)) {
			throw new Error(`Invalid interval minutes: ${intervalMinutes}`);
		}
		const nextRunMinutes = this.calculateFirstRunTime(intervalMinutes);
		this.tasks.push({ name, intervalMinutes, nextRunMinutes, fn });
	}

	public start(): void {
		if (this.interval) {
			return;
		}

		this.interval = setInterval(async () => {
			const nowMilliseconds = Date.now();
			const nowMinutes = Math.floor(nowMilliseconds / 60_000);

			for (const task of this.tasks) {
				if (nowMinutes >= task.nextRunMinutes) {
					task.nextRunMinutes += task.intervalMinutes;
					try {
						await task.fn(nowMilliseconds);
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
