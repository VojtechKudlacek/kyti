import { Flex } from 'antd';
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
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { fetchConfigAtom } from 'store/config';
import { fetchLogsAtom } from 'store/logs';
import { fetchRecordsAtom } from 'store/records';
import { AdminZone } from 'ui/containers/AdminZone';
import { Authentication } from 'ui/containers/Authentication';
import { ConfigCard } from 'ui/containers/ConfigCard';
import { CurrentStateCard } from 'ui/containers/CurrentStateCard';
import { GraphsCard } from 'ui/containers/GraphsCard';
import { LogsCard } from 'ui/containers/LogsCard';

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
	const fetchConfig = useSetAtom(fetchConfigAtom);

	useEffect(() => {
		console.log(socket.id);
	}, []);

	useEffect(() => {
		fetchRecords();
		fetchLogs();
		fetchConfig();
	}, [fetchRecords, fetchLogs, fetchConfig]);

	return (
		<Flex gap="small" vertical>
			<CurrentStateCard />
			<GraphsCard />
			<AdminZone>
				<ConfigCard />
				<LogsCard />
			</AdminZone>
			<Authentication />
		</Flex>
	);
}
