import { Timeline, type TimelineItemProps } from 'antd';
import { format } from 'date-fns';
import type { ApiLog } from 'types';
import styles from './LogList.module.css';

interface LogListProps {
	logs: Array<ApiLog>;
}

export function LogList({ logs }: LogListProps) {
	const items: Array<TimelineItemProps> = logs.map((log) => ({
		children: (
			<span>
				[{format(log.timestamp, 'dd.MM.yyyy HH:mm')}] {log.message}
			</span>
		),
		color: log.type === 'INFO' ? 'blue' : log.type === 'WARNING' ? 'orange' : 'red',
	}));

	return <Timeline items={items} className={styles.logList} />;
}
