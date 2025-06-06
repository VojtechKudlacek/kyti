import { useAtomValue } from 'jotai';
import type { PropsWithChildren } from 'react';
import { secretAtom } from 'store/secret';

export function AdminZone({ children }: PropsWithChildren) {
	const secret = useAtomValue(secretAtom);

	if (!secret) {
		return null;
	}

	return children;
}
