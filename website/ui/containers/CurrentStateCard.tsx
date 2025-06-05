import { Card, Skeleton } from 'antd';
import { useAtomValue } from 'jotai';
import { lastRecordAtom } from 'store/records';
import { CurrentState } from 'ui/components/CurrentState';

export function CurrentStateCard() {
	const lastRecord = useAtomValue(lastRecordAtom);

	return (
		<Card size="small" title="Current State">
			{lastRecord ? (
				<CurrentState
					temperature={lastRecord.temperature ? `${lastRecord.temperature}°C` : '-'}
					humidity={lastRecord.humidity ? `${lastRecord.humidity}%` : '-'}
				/>
			) : (
				<Skeleton active />
			)}
		</Card>
	);
}
