import { Flex } from 'antd';
import { socket } from 'api/socket';
import { useSetAtom } from 'jotai';
import { lazy, useEffect } from 'react';
import { fetchConfigAtom } from 'store/config';
import { fetchLogsAtom } from 'store/logs';
import { fetchRecordsAtom } from 'store/records';
import { CurrentStateCard } from 'ui/containers/CurrentStateCard';
import { GraphsCard } from 'ui/containers/GraphsCard';

const AdminZone = lazy(() => import('ui/containers/AdminZone').then((module) => ({ default: module.AdminZone })));
const Authentication = lazy(() =>
	import('ui/containers/Authentication').then((module) => ({ default: module.Authentication })),
);
const ConfigCard = lazy(() => import('ui/containers/ConfigCard').then((module) => ({ default: module.ConfigCard })));
const LogsCard = lazy(() => import('ui/containers/LogsCard').then((module) => ({ default: module.LogsCard })));

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
