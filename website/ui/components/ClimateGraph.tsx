import type { ChartData, ChartOptions, CoreScaleOptions, Scale, TooltipItem } from 'chart.js';
import type { AnnotationPluginOptions } from 'chartjs-plugin-annotation';
import { Chart } from 'react-chartjs-2';
import type { ApiConfig, ApiRecord } from 'types';

interface ClimateGraphProps {
	records: Array<ApiRecord>;
	config: ApiConfig;
	labels: Array<string>;
}

type GraphOptions = ChartOptions<'line'> & {
	plugins: { annotation: AnnotationPluginOptions };
};
type GraphData = ChartData<'line', Array<number | null>, string>;

const temperatureTitle = 'Temperature';
const temperatureSuffix = '°C';
const temperatureColor = '#FF6B6B';
const humidityTitle = 'Humidity';
const humiditySuffix = '%';
const humidityColor = '#4ECDC4';

export function ClimateGraph({ records, config, labels }: ClimateGraphProps) {
	const chartData: GraphData = {
		labels,
		datasets: [
			{
				label: temperatureTitle,
				data: records.map(({ temperature }) => temperature),
				borderColor: temperatureColor,
				backgroundColor: temperatureColor,
				yAxisID: 'yTemperature',
				tension: 0.5,
				type: 'line' as const,
			},
			{
				label: humidityTitle,
				data: records.map(({ humidity }) => humidity),
				borderColor: humidityColor,
				backgroundColor: humidityColor,
				yAxisID: 'yHumidity',
				tension: 0.5,
				type: 'line' as const,
			},
		],
	};

	const options: GraphOptions = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			mode: 'index',
			intersect: false,
		},
		plugins: {
			title: {
				display: false,
			},
			legend: {
				display: false,
			},
			annotation: {
				annotations: {
					temperatureMin: {
						type: 'line',
						yMin: config.TEMPERATURE_MIN,
						yMax: config.TEMPERATURE_MIN,
						borderColor: `${temperatureColor}70`,
						borderWidth: 3,
						borderDash: [5, 5],
					},
					temperatureMax: {
						type: 'line',
						yMin: config.TEMPERATURE_MAX,
						yMax: config.TEMPERATURE_MAX,
						borderColor: `${temperatureColor}70`,
						borderWidth: 3,
						borderDash: [5, 5],
					},
					humidityMin: {
						type: 'line',
						yMin: config.HUMIDITY_MIN,
						yMax: config.HUMIDITY_MIN,
						borderColor: `${humidityColor}70`,
						borderWidth: 3,
						borderDash: [5, 5],
					},
					humidityMax: {
						type: 'line',
						yMin: config.HUMIDITY_MAX,
						yMax: config.HUMIDITY_MAX,
						borderColor: `${humidityColor}70`,
						borderWidth: 3,
						borderDash: [5, 5],
					},
				},
			},
			tooltip: {
				callbacks: {
					label: function (context: TooltipItem<'line'>) {
						const label = context.dataset.label || '';
						const value = context.parsed.y;
						const suffix = label === temperatureTitle ? temperatureSuffix : humiditySuffix;
						return `${label}: ${value}${suffix}`;
					},
				},
			},
		},
		scales: {
			yTemperature: {
				type: 'linear',
				display: true,
				position: 'left',
				min: config.GRAPH_TEMPERATURE_MIN,
				max: config.GRAPH_TEMPERATURE_MAX,
				title: {
					display: true,
					text: temperatureTitle,
					color: temperatureColor,
				},
				ticks: {
					color: temperatureColor,
					callback: function (this: Scale<CoreScaleOptions>, tickValue: number | string) {
						return `${tickValue}${temperatureSuffix}`;
					},
				},
			},
			yHumidity: {
				type: 'linear',
				display: true,
				position: 'right',
				min: config.GRAPH_HUMIDITY_MIN,
				max: config.GRAPH_HUMIDITY_MAX,
				title: {
					display: true,
					text: humidityTitle,
					color: humidityColor,
				},
				ticks: {
					color: humidityColor,
					callback: function (this: Scale<CoreScaleOptions>, tickValue: number | string) {
						return `${tickValue}${humiditySuffix}`;
					},
				},
			},
		},
	};

	return (
		<div style={{ width: '100%', height: '300px' }}>
			<Chart type="line" data={chartData} options={options} />
		</div>
	);
}
