import { Table, Tag } from 'antd';
import { format } from 'date-fns';
import { useMemo } from 'react';
import type { ApiLog } from 'types';

const columnsDefinition = [
	{
		title: 'Message',
		dataIndex: 'message',
		key: 'message',
	},
	{
		title: 'Time',
		dataIndex: 'time',
		key: 'time',
	},
	{
		title: 'Type',
		dataIndex: 'type',
		key: 'type',
		render: (type: string) => {
			return <Tag color={type === 'INFO' ? 'blue' : type === 'WARNING' ? 'orange' : 'red'}>{type}</Tag>;
		},
	},
];

interface LogListProps {
	logs: Array<ApiLog>;
}

export function LogList({ logs }: LogListProps) {
	const dataSource = useMemo(() => {
		return logs.map((log) => ({
			key: `LogList-${log.timestamp}`,
			message: log.message,
			type: log.type,
			time: format(log.timestamp, 'dd.MM.yyyy HH:mm:ss'),
		}));
	}, [logs]);

	return <Table dataSource={dataSource} columns={columnsDefinition} />;
}
