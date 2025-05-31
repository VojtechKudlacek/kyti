import { getConfigRequest } from 'api/calls';
import { atom } from 'jotai';
import type { ApiConfig } from 'types';

export const configAtom = atom<ApiConfig | null>(null);

export const fetchConfigAtom = atom(null, async (_get, set) => {
	const config = await getConfigRequest();
	set(configAtom, config);
});

// export const updateConfigAtom = atom(null, (_get, set, config: ApiConfig) => {
// 	set(configAtom, config);
// });
