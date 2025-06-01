import type { ChartData, ChartOptions, CoreScaleOptions, Scale, TooltipItem } from 'chart.js';
import { Chart } from 'react-chartjs-2';

interface OnOffGraphProps {
	title: string;
	color: string;
	labels: Array<string>;
	data: Array<number>;
}

type GraphOptions = ChartOptions<'line'>;
type GraphData = ChartData<'line', Array<number>, string>;

export function OnOffGraph({ title, color, labels, data }: OnOffGraphProps) {
	const chartData: GraphData = {
		labels,
		datasets: [
			{
				label: title,
				data,
				borderColor: color,
				backgroundColor: `${color}30`,
				fill: true,
				type: 'line' as const,
				tension: 0,
				pointRadius: 0,
				stepped: true,
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
			annotation: {
				annotations: {
					offState: {
						type: 'line',
						yMin: 0,
						yMax: 0,
						borderColor: `${color}50`,
						borderWidth: 3,
						borderDash: [5, 5],
					},
				},
			},
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: function (context: TooltipItem<'line'>) {
						const label = context.dataset.label || '';
						const value = context.parsed.y;
						return `${label}: ${value === 1 ? 'On' : 'Off'}`;
					},
				},
			},
		},
		scales: {
			x: {
				ticks: {
					display: false,
				},
			},
			y: {
				type: 'linear',
				display: true,
				offset: true,
				position: 'left',
				title: {
					display: true,
					text: title,
					color,
				},
				min: 0,
				max: 1,
				grid: {
					drawOnChartArea: false,
				},
				ticks: {
					color,
					stepSize: 1,
					callback: function (this: Scale<CoreScaleOptions>, tickValue: number | string) {
						return tickValue === 1 ? 'On' : 'Off';
					},
				},
			},
		},
	};

	return (
		<div style={{ width: '100%', height: '70px' }}>
			<Chart type="line" data={chartData} options={options} />
		</div>
	);
}
