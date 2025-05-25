import { atom } from 'jotai';
import type { ApiRecord } from 'types';

export const recordsAtom = atom<Array<ApiRecord>>([]);
