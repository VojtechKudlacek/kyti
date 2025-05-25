import { atom } from 'jotai';
import type { ApiLog } from 'types';

export const logsAtom = atom<Array<ApiLog>>([]);
