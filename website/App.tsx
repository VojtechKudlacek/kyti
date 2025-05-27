import { socket } from 'api/socket';
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Filler,
	Legend,
	LineController,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js';
import type { ChartOptions, CoreScaleOptions, Scale, TooltipItem } from 'chart.js';
import annotationPlugin, { type AnnotationPluginOptions } from 'chartjs-plugin-annotation';
import { format } from 'date-fns';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import { fetchLogsAtom, logsAtom } from 'store/logs';
import { fetchRecordsAtom, recordsAtom } from 'store/records';

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	LineController,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Filler,
	annotationPlugin,
);

export function App() {
	const records = useAtomValue(recordsAtom);
	const fetchRecords = useSetAtom(fetchRecordsAtom);
	const logs = useAtomValue(logsAtom);
	const fetchLogs = useSetAtom(fetchLogsAtom);

	useEffect(() => {
		console.log(socket.id);
	}, []);

	useEffect(() => {
		fetchRecords();
		fetchLogs();
	}, [fetchRecords, fetchLogs]);

	const chartData = {
		labels: records.map(({ timestamp }) => format(timestamp, 'HH:mm')),
		datasets: [
			{
				label: 'Temperature',
				data: records.map((record) => record.temperature),
				borderColor: '#FF6B6B',
				backgroundColor: '#FF6B6B',
				yAxisID: 'y',
				tension: 0.4,
				type: 'line' as const,
			},
			{
				label: 'Humidity',
				data: records.map((record) => record.humidity),
				borderColor: '#4ECDC4',
				backgroundColor: '#4ECDC4',
				yAxisID: 'y1',
				tension: 0.4,
				type: 'line' as const,
			},
			{
				label: 'Light',
				data: records.map((record) => (record.light ? 4 : 0)),
				borderColor: '#FFD700',
				backgroundColor: '#FFD700',
				yAxisID: 'y2',
				type: 'line' as const,
				stepped: true,
				tension: 0,
				pointRadius: 0,
			},
			{
				label: 'Ventilator',
				data: records.map((record) => (record.ventilator ? 3 : 0)),
				borderColor: '#6C5CE7',
				backgroundColor: '#6C5CE7',
				yAxisID: 'y2',
				type: 'line' as const,
				stepped: true,
				tension: 0,
				pointRadius: 0,
			},
			{
				label: 'Humidifier',
				data: records.map((record) => (record.humidifier ? 2 : 0)),
				borderColor: '#00B894',
				backgroundColor: '#00B894',
				yAxisID: 'y2',
				type: 'line' as const,
				stepped: true,
				tension: 0,
				pointRadius: 0,
			},
			{
				label: 'Fan',
				data: records.map((record) => (record.fan ? 1 : 0)),
				borderColor: '#E17055',
				backgroundColor: '#E17055',
				yAxisID: 'y2',
				type: 'line' as const,
				stepped: true,
				tension: 0,
				pointRadius: 0,
			},
		],
	};

	const options: ChartOptions<'line'> & {
		plugins: { annotation: AnnotationPluginOptions };
	} = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			mode: 'index',
			intersect: false,
		},
		plugins: {
			title: {
				display: true,
				text: 'Last hour tent data',
			},
			annotation: {
				annotations: {
					tempMin: {
						type: 'line',
						yMin: 22,
						yMax: 22,
						borderColor: '#FF6B6B',
						borderWidth: 3,
						borderDash: [5, 5],
					},
					tempMax: {
						type: 'line',
						yMin: 26,
						yMax: 26,
						borderColor: '#FF6B6B',
						borderWidth: 3,
						borderDash: [5, 5],
					},
					humidityMin: {
						type: 'line',
						yMin: 55,
						yMax: 55,
						borderColor: '#4ECDC4',
						borderWidth: 3,
						borderDash: [5, 5],
						yScaleID: 'y1',
					},
					humidityMax: {
						type: 'line',
						yMin: 65,
						yMax: 65,
						borderColor: '#4ECDC4',
						borderWidth: 3,
						borderDash: [5, 5],
						yScaleID: 'y1',
					},
				},
			},
			tooltip: {
				callbacks: {
					label: function (context: TooltipItem<'line'>) {
						const label = context.dataset.label || '';
						const value = context.parsed.y;

						if (['Light', 'Ventilator', 'Humidifier', 'Fan'].includes(label)) {
							return `${label}: ${value ? 'on' : 'off'}`;
						}

						if (label === 'Temperature') {
							return `${label}: ${value}°C`;
						}

						if (label === 'Humidity') {
							return `${label}: ${value}%`;
						}

						return `${label}: ${value}`;
					},
				},
			},
		},
		scales: {
			x: {
				title: {
					display: true,
					text: 'Time',
				},
			},
			y: {
				type: 'linear',
				display: true,
				position: 'left',
				min: 20,
				max: 28,
				title: {
					display: true,
					text: 'Temperature',
					color: '#FF6B6B',
				},
				ticks: {
					color: '#FF6B6B',
					callback: function (this: Scale<CoreScaleOptions>, tickValue: number | string) {
						return `${tickValue}°C`;
					},
				},
			},
			y1: {
				type: 'linear',
				display: true,
				position: 'right',
				min: 40,
				max: 80,
				title: {
					display: true,
					text: 'Humidity',
					color: '#4ECDC4',
				},
				ticks: {
					color: '#4ECDC4',
					callback: function (this: Scale<CoreScaleOptions>, tickValue: number | string) {
						return `${tickValue}%`;
					},
				},
				grid: {
					drawOnChartArea: false,
				},
			},
			y2: {
				type: 'linear',
				display: false,
				position: 'right',
				min: 0,
				max: 20,
				title: {
					display: false,
					text: 'Devices',
				},
				ticks: {
					stepSize: 1,
					includeBounds: true,
					autoSkip: false,
					count: 6,
				},
				grid: {
					drawOnChartArea: false,
				},
			},
		},
	};

	return (
		<div>
			<div style={{ height: '100vh', margin: '0 auto' }}>
				<Chart type="line" data={chartData} options={options} />
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '32px 64px' }}>
				{logs.map((log) => (
					<div key={log.timestamp.toString()} style={{ display: 'flex', gap: '10px', fontFamily: 'monospace' }}>
						<span>{`[${format(log.timestamp, 'HH:mm')}]`}</span>
						<span>{log.message}</span>
					</div>
				))}
			</div>
		</div>
	);
}

// TEMPERATURE_MIN=22
// TEMPERATURE_MAX=26
// TEMPERATURE_RANGE=1
// HUMIDITY_MIN=55
// HUMIDITY_MAX=65
// HUMIDITY_RANGE=5
