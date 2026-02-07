import { atom } from 'jotai';
import type { OutletStatus } from 'types';

export const outletStateAtom = atom<Record<number, OutletStatus>>({});
