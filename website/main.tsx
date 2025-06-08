import '@ant-design/v5-patch-for-react-19';
import './index.css';
import 'api/socket';

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
import annotationPlugin from 'chartjs-plugin-annotation';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';

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

const root = document.getElementById('root');
if (!root) {
	throw new Error('Root element not found');
}

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
