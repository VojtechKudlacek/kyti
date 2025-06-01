import { Card } from 'antd';
import { useAtomValue } from 'jotai';
import { logsAtom } from 'store/logs';
import { LogList } from 'ui/components/LogList';

export function LogsContainer() {
	const logs = useAtomValue(logsAtom);

	return (
		<Card title="Logs" size="small">
			<LogList logs={logs.slice(0, 10)} />
		</Card>
	);
}
