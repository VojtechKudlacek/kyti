export const Path = {
	Records: '/records',
	Logs: '/logs',
} as const;

type PathType = (typeof Path)[keyof typeof Path];

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export const baseUrl = 'https://kyti.vojtechkudlacek.cz';
export const apiPath = `${baseUrl}/api`;

interface RequestOptions {
	method?: Method;
	body?: string;
	query?: Record<string, string>;
	params?: Record<string, string>;
}

export async function request<T = unknown>(path: PathType, options: RequestOptions = {}): Promise<T> {
	let url = `${apiPath}${path}`;
	for (const [key, value] of Object.entries(options.params ?? {})) {
		url = url.replace(`:${key}`, value);
	}
	const query = new URLSearchParams(options.query ?? {}).toString();
	if (query) {
		url += `?${query}`;
	}
	const response = await fetch(url, {
		method: options.method ?? 'GET',
		body: options.body,
	});
	const result = await response.json();
	return result;
}
