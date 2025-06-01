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
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { configAtom, fetchConfigAtom } from 'store/config';
import { fetchLogsAtom } from 'store/logs';
import { fetchRecordsAtom } from 'store/records';
import { ConfigOverviewContainer } from 'ui/containers/ConfigOverviewContainer';
import { CurrentStateContainer } from 'ui/containers/CurrentStateContainer';
import { GraphContainer } from 'ui/containers/GraphContainer';
import { LogsContainer } from 'ui/containers/LogsContainer';

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
		<div style={{ padding: '16px', backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column', gap: '10px' }}>
			<CurrentStateContainer />
			<GraphContainer />
			<LogsContainer />
			<ConfigOverviewContainer />
		</div>
	);
}
