import { socket } from 'api/socket';
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Filler,
	Legend,
	LineController,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { format } from 'date-fns';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { configAtom, fetchConfigAtom } from 'store/config';
import { fetchLogsAtom, logsAtom } from 'store/logs';
import { fetchRecordsAtom } from 'store/records';
import { GraphContainer } from 'ui/containers/GraphContainer';

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	LineController,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Filler,
	annotationPlugin,
);

export function App() {
	const fetchRecords = useSetAtom(fetchRecordsAtom);
	const logs = useAtomValue(logsAtom);
	const fetchLogs = useSetAtom(fetchLogsAtom);
	const config = useAtomValue(configAtom);
	const fetchConfig = useSetAtom(fetchConfigAtom);

	useEffect(() => {
		console.log(socket.id);
	}, []);

	useEffect(() => {
		fetchRecords();
		fetchLogs();
		fetchConfig();
	}, [fetchRecords, fetchLogs, fetchConfig]);

	if (!config) {
		return <div>Loading...</div>;
	}

	return (
		<div style={{ padding: '16px' }}>
			<div style={{ margin: '0 auto' }}>
				<GraphContainer />
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px' }}>
				{logs.map((log) => (
					<div key={log.timestamp.toString()} style={{ display: 'flex', gap: '10px', fontFamily: 'monospace' }}>
						<span>{`[${format(log.timestamp, 'HH:mm')}]`}</span>
						<span>{log.message}</span>
					</div>
				))}
			</div>
		</div>
	);
}
