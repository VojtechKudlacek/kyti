import { Table, Tag } from 'antd';
import { format } from 'date-fns';
import type { ApiLog } from 'types';

interface LogListProps {
	logs: Array<ApiLog>;
}

export function LogList({ logs }: LogListProps) {
	return (
		<Table
			size="small"
			dataSource={logs.map((log) => ({ ...log, key: `LogList-${log.timestamp}` }))}
			columns={[
				{
					title: 'Type',
					dataIndex: 'type',
					key: 'type',
					render: (type) => <Tag color={type === 'INFO' ? 'blue' : type === 'WARNING' ? 'orange' : 'red'}>{type}</Tag>,
				},
				{ title: 'Message', dataIndex: 'message', key: 'message' },
				{
					title: 'Time',
					dataIndex: 'timestamp',
					key: 'timestamp',
					render: (timestamp) => format(timestamp, 'dd.MM.yyyy HH:mm'),
				},
			]}
		/>
	);
}
