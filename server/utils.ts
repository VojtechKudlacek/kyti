export function stringifyError(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	return String(error);
}

export function timeoutPromise<T>(promise: () => Promise<T>, timeout: number): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new Error(`Timeout after ${timeout}ms`));
		}, timeout);

		promise()
			.then((result) => {
				clearTimeout(timer);
				resolve(result);
			})
			.catch((error) => {
				clearTimeout(timer);
				reject(error);
			});
	});
}

export async function retryPromise<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T> {
	let lastError: unknown;

	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;
			if (attempt < retries) {
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}

	throw lastError;
}

export function retryPromiseWithTimeout<T>(
	fn: () => Promise<T>,
	timeout = 5000,
	retries = 3,
	delay = 1000,
): Promise<T> {
	return retryPromise(() => timeoutPromise(fn, timeout), retries, delay);
}
