import { Descriptions, type DescriptionsProps } from 'antd';
import type { ApiConfig } from 'types';

interface ConfigOverviewProps {
	config: ApiConfig;
}

export function ConfigOverview({ config }: ConfigOverviewProps) {
	const items: DescriptionsProps['items'] = [
		{
			key: 'ConfigOverview-TEMPERATURE_MAX',
			label: 'Maximal Temperature',
			span: { xs: 1, md: 4 },
			children: <span>{config.TEMPERATURE_MAX}°C</span>,
		},
		{
			key: 'ConfigOverview-TEMPERATURE_SUFFICIENT',
			label: 'Sufficient Temperature',
			span: { xs: 1, md: 4 },
			children: <span>{config.TEMPERATURE_SUFFICIENT}°C</span>,
		},
		{
			key: 'ConfigOverview-TEMPERATURE_MIN',
			label: 'Minimal Temperature',
			span: { xs: 1, md: 4 },
			children: <span>{config.TEMPERATURE_MIN}°C</span>,
		},
		{
			key: 'ConfigOverview-HUMIDITY_MAX',
			label: 'Maximal Humidity',
			span: { xs: 1, md: 4 },
			children: <span>{config.HUMIDITY_MAX}%</span>,
		},
		{
			key: 'ConfigOverview-HUMIDITY_SUFFICIENT',
			label: 'Sufficient Humidity',
			span: { xs: 1, md: 4 },
			children: <span>{config.HUMIDITY_SUFFICIENT}%</span>,
		},
		{
			key: 'ConfigOverview-HUMIDITY_MIN',
			label: 'Minimal Humidity',
			span: { xs: 1, md: 4 },
			children: <span>{config.HUMIDITY_MIN}%</span>,
		},
		{
			key: 'ConfigOverview-GRAPH_HUMIDITY_MIN',
			label: 'Minimal Temperature Graph',
			span: { xs: 1, md: 6 },
			children: <span>{config.GRAPH_TEMPERATURE_MIN}°C</span>,
		},
		{
			key: 'ConfigOverview-GRAPH_TEMPERATURE_MAX',
			label: 'Maximal Temperature Graph',
			span: { xs: 1, md: 6 },
			children: <span>{config.GRAPH_TEMPERATURE_MAX}°C</span>,
		},
		{
			key: 'ConfigOverview-GRAPH_HUMIDITY_MIN',
			label: 'Minimal Humidity Graph',
			span: { xs: 1, md: 6 },
			children: <span>{config.GRAPH_HUMIDITY_MIN}%</span>,
		},
		{
			key: 'ConfigOverview-GRAPH_HUMIDITY_MAX',
			label: 'Maximal Humidity Graph',
			span: { xs: 1, md: 6 },
			children: <span>{config.GRAPH_HUMIDITY_MAX}%</span>,
		},
		{
			key: 'ConfigOverview-OUTLET_SLOT_LIGHT',
			label: 'Outlet Slot Light',
			span: { xs: 1, md: 6 },
			children: <span>{config.OUTLET_SLOT_LIGHT}</span>,
		},
		{
			key: 'ConfigOverview-OUTLET_SLOT_VENTILATOR',
			label: 'Outlet Slot Ventilator',
			span: { xs: 1, md: 6 },
			children: <span>{config.OUTLET_SLOT_VENTILATOR}</span>,
		},
		{
			key: 'ConfigOverview-OUTLET_SLOT_HUMIDIFIER',
			label: 'Outlet Slot Humidifier',
			span: { xs: 1, md: 6 },
			children: <span>{config.OUTLET_SLOT_HUMIDIFIER}</span>,
		},
		{
			key: 'ConfigOverview-OUTLET_SLOT_FAN',
			label: 'Outlet Slot Fan',
			span: { xs: 1, md: 6 },
			children: <span>{config.OUTLET_SLOT_FAN}</span>,
		},
	];

	return (
		<Descriptions items={items} size="small" column={{ xs: 1, sm: 1, md: 12, lg: 12, xl: 12, xxl: 12 }} bordered />
	);
}
