import { useAtomValue } from 'jotai';
import { secretAtom } from 'store/secret';
import { Authentication } from './Authentication';
import { ConfigCard } from './ConfigCard';
import { LogsCard } from './LogsCard';

export function AdminZone() {
	const secret = useAtomValue(secretAtom);

	return (
		<>
			{secret && (
				<>
					<ConfigCard />
					<LogsCard />
				</>
			)}
			<Authentication />
		</>
	);
}
