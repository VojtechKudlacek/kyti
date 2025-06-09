import { getConfigRequest, setConfigRequest } from 'api/calls';
import { atom } from 'jotai';
import type { ApiConfig } from 'types';

export const configAtom = atom<ApiConfig | null>(null);

export const fetchConfigAtom = atom(null, async (_get, set) => {
	const config = await getConfigRequest();
	set(configAtom, config);
});

export const changeConfigValueAtom = atom(
	null,
	(get, set, [key, value]: [keyof ApiConfig, ApiConfig[keyof ApiConfig]]) => {
		const config = get(configAtom);
		if (!config) {
			return;
		}
		set(configAtom, { ...config, [key]: value });
	},
);

export const updateConfigAtom = atom(
	null,
	async (_get, set, [key, value]: [keyof ApiConfig, ApiConfig[keyof ApiConfig]]) => {
		await setConfigRequest(key, value);
		set(changeConfigValueAtom, [key, value]);
	},
);
