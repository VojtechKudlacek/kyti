import type { ChartData, ChartOptions, CoreScaleOptions, Scale, TooltipItem } from 'chart.js';
import type { AnnotationPluginOptions } from 'chartjs-plugin-annotation';
import { Chart } from 'react-chartjs-2';

interface ValueGraphProps<T = unknown> {
	title: string;
	suffix: string;
	color: string;
	labels: Array<string>;
	min: number;
	max: number;
	graphMin: number;
	graphMax: number;
	data: Array<T>;
}

type GraphOptions = ChartOptions<'line'> & { plugins: { annotation: AnnotationPluginOptions } };
type GraphData<T> = ChartData<'line', Array<T>, string>;

export function ValueGraph<T>({
	title,
	suffix,
	color,
	labels,
	min,
	max,
	graphMin,
	graphMax,
	data,
}: ValueGraphProps<T>) {
	const chartData: GraphData<T> = {
		labels,
		datasets: [
			{
				label: title,
				data,
				borderColor: color,
				yAxisID: 'y',
				tension: 0.4,
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
				display: true,
				text: `${title} data`,
			},
			legend: {
				display: false,
			},
			annotation: {
				annotations: {
					tempMin: {
						type: 'line',
						yMin: min,
						yMax: min,
						borderColor: color,
						borderWidth: 3,
						borderDash: [5, 5],
					},
					tempMax: {
						type: 'line',
						yMin: max,
						yMax: max,
						borderColor: color,
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
						return `${label}: ${value}${suffix}`;
					},
				},
			},
		},
		scales: {
			y: {
				type: 'linear',
				display: true,
				position: 'left',
				min: graphMin,
				max: graphMax,
				title: {
					display: true,
					text: title,
					color,
				},
				ticks: {
					color,
					callback: function (this: Scale<CoreScaleOptions>, tickValue: number | string) {
						return `${tickValue}${suffix}`;
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
