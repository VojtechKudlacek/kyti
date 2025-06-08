import { Table, type TableColumnsType, Typography } from 'antd';
import { configKeyTexts } from 'const/config';
import { useMemo } from 'react';
import type { ApiConfig } from 'types';

type TableColumnDefinition = TableColumnsType<{
	key: string;
	configKey: keyof ApiConfig;
	configValue: number | boolean | string;
}>;

const columnsDefinition: TableColumnDefinition = [
	{
		title: 'Config',
		dataIndex: 'configKey',
		key: 'configKey',
		render: (key: keyof ApiConfig) => {
			return <Typography.Text>{configKeyTexts[key]}</Typography.Text>;
		},
	},
	{
		title: 'Value',
		dataIndex: 'configValue',
		key: 'configValue',
		render: (value: number | boolean) => {
			if (typeof value === 'boolean') {
				return <Typography.Text code>{value ? 'true' : 'false'}</Typography.Text>;
			}
			return <Typography.Text>{value}</Typography.Text>;
		},
	},
];

interface ConfigOverviewProps {
	config: ApiConfig;
}

export function ConfigTable({ config }: ConfigOverviewProps) {
	const dataSource = useMemo(() => {
		const keys = Object.keys(config);
		return keys.map((key) => ({
			key: `ConfigTable-${key}`,
			configKey: key as keyof ApiConfig,
			configValue: config[key as keyof ApiConfig],
		}));
	}, [config]);

	return <Table pagination={false} size="small" dataSource={dataSource} columns={columnsDefinition} />;
}
