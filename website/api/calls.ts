import { Path, request } from 'api/common';
import type { ApiConfig, ApiLog, ApiRecord } from 'types';

export async function getRecordsRequest(from: number, to: number): Promise<Array<ApiRecord>> {
	return await request<Array<ApiRecord>>(Path.Records, { query: { from: from.toString(), to: to.toString() } });
}

export async function getLogsRequest(): Promise<Array<ApiLog>> {
	return await request<Array<ApiLog>>(Path.Logs);
}

export async function getConfigRequest(): Promise<ApiConfig> {
	return await request<ApiConfig>(Path.Config);
}
