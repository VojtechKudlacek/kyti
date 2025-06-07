import { atomWithStorage } from 'jotai/utils';

export const secretAtom = atomWithStorage<string | null>('secret', null);
