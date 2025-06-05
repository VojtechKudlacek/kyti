import { Card, Skeleton } from 'antd';
import { useAtomValue } from 'jotai';
import { logsAtom } from 'store/logs';
import { LogList } from 'ui/components/LogList';

export function LogsCard() {
	const logs = useAtomValue(logsAtom);

	return (
		<Card title="Logs" size="small">
			{logs ? <LogList logs={logs.slice(0, 10)} /> : <Skeleton active />}
		</Card>
	);
}
