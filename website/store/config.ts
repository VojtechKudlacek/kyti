import { getConfigRequest, setConfigRequest } from 'api/calls';
import { type Getter, type Setter, atom } from 'jotai';
import type { ApiConfig } from 'types';

export const configAtom = atom<ApiConfig | null>(null);

export const fetchConfigAtom = atom(null, async (_get, set) => {
	const config = await getConfigRequest();
	set(configAtom, config);
});

export const updateConfigAtom = atom(
	null,
	async <T extends keyof ApiConfig>(get: Getter, set: Setter, [key, value]: [T, ApiConfig[T]]) => {
		const config = get(configAtom);
		if (!config) {
			return;
		}
		await setConfigRequest(key, value);
		set(configAtom, { ...config, [key]: value });
	},
);
