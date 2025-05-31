import type { ApiConfig, ApiRecord } from 'types';
import { ValueGraph } from 'ui/primitives/ValueGraph';

interface TemperatureGraphProps {
	records: Array<ApiRecord>;
	config: ApiConfig;
	labels: Array<string>;
}

export function TemperatureGraph({ records, config, labels }: TemperatureGraphProps) {
	return (
		<ValueGraph
			title="Temperature"
			suffix="°C"
			color="#FF6B6B"
			labels={labels}
			min={config.TEMPERATURE_MIN}
			max={config.TEMPERATURE_MAX}
			graphMin={config.GRAPH_TEMPERATURE_MIN}
			graphMax={config.GRAPH_TEMPERATURE_MAX}
			data={records.map(({ temperature }) => temperature)}
		/>
	);
}
