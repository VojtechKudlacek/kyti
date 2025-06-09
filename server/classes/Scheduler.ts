import assert from 'node:assert/strict';
import { addSeconds, differenceInSeconds, startOfDay, startOfSecond } from 'date-fns';
import { LogType, log } from '../db/log';
import { stringifyError } from '../utils';

const allowedIntervalSeconds = [
	1, // 1 second
	2, // 2 seconds
	3, // 3 seconds
	4, // 4 seconds
	5, // 5 seconds
	6, // 6 seconds
	10, // 10 seconds
	15, // 15 seconds
	20, // 20 seconds
	30, // 30 seconds
	60, // 1 minute
	60 * 2, // 2 minutes
	60 * 3, // 3 minutes
	60 * 4, // 4 minutes
	60 * 5, // 5 minutes
	60 * 6, // 6 minutes
	60 * 10, // 10 minutes
	60 * 15, // 15 minutes
	60 * 20, // 20 minutes
	60 * 30, // 30 minutes
	60 * 60, // 1 hour
];

type TaskFn = (timestamp: number) => void | Promise<void>;

interface Task {
	name: string;
	intervalSeconds: number;
	nextRunSeconds: number;
	fn: TaskFn;
}

export class Scheduler {
	private tasks: Array<Task> = [];
	private interval: NodeJS.Timeout | null = null;

	private calculateFirstRunTime(intervalSeconds: number): number {
		const now = startOfSecond(new Date());
		const secondsSinceStartOfDay = differenceInSeconds(now, startOfDay(now));
		const secondsUntilNextRun = intervalSeconds - (secondsSinceStartOfDay % intervalSeconds);
		const nextRun = addSeconds(now, secondsUntilNextRun);
		return nextRun.getTime() / 1000;
	}

	public addTask(name: string, intervalSeconds: number, fn: TaskFn): void {
		assert(allowedIntervalSeconds.includes(intervalSeconds), `Invalid interval seconds: ${intervalSeconds}`);
		const nextRunSeconds = this.calculateFirstRunTime(intervalSeconds);
		this.tasks.push({ name, intervalSeconds, nextRunSeconds, fn });
	}

	public start(): void {
		if (this.interval) {
			return;
		}

		this.interval = setInterval(async () => {
			const nowMilliseconds = Date.now();
			const nowSeconds = Math.floor(nowMilliseconds / 1000);

			for (const task of this.tasks) {
				if (nowSeconds >= task.nextRunSeconds) {
					task.nextRunSeconds += task.intervalSeconds;
					try {
						log(`Executing task "${task.name}"`, LogType.Info, false);
						await task.fn(nowMilliseconds);
					} catch (error) {
						log(`Error executing task "${task.name}": ${stringifyError(error)}`, LogType.Error);
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
