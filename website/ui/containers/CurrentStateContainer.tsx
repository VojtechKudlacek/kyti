import { Card } from 'antd';
import { useAtomValue } from 'jotai';
import { lastRecordAtom } from 'store/records';
import { CurrentState } from 'ui/components/CurrentState';

export function CurrentStateContainer() {
	const lastRecord = useAtomValue(lastRecordAtom);

	return (
		<Card size="small" title="Current State">
			<CurrentState temperature={lastRecord?.temperature ?? 0} humidity={lastRecord?.humidity ?? 0} />
		</Card>
	);
}
