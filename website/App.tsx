import { Flex } from 'antd';
import { useSetAtom } from 'jotai';
import { lazy, useEffect } from 'react';
import { fetchConfigAtom } from 'store/config';
import { fetchLogsAtom } from 'store/logs';
import { fetchRecordsAtom } from 'store/records';
import { CurrentStateCard } from 'ui/containers/CurrentStateCard';
import { GraphsCard } from 'ui/containers/GraphsCard';

const AdminZone = lazy(() => import('ui/containers/AdminZone').then((module) => ({ default: module.AdminZone })));

export function App() {
	const fetchRecords = useSetAtom(fetchRecordsAtom);
	const fetchLogs = useSetAtom(fetchLogsAtom);
	const fetchConfig = useSetAtom(fetchConfigAtom);

	useEffect(() => {
		fetchRecords();
		fetchLogs();
		fetchConfig();
	}, [fetchRecords, fetchLogs, fetchConfig]);

	return (
		<Flex gap="small" vertical>
			<CurrentStateCard />
			<GraphsCard />
			<AdminZone />
		</Flex>
	);
}
