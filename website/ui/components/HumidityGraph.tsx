import type { ApiConfig, ApiRecord } from 'types';
import { ValueGraph } from 'ui/primitives/ValueGraph';

interface HumidityGraphProps {
	records: Array<ApiRecord>;
	config: ApiConfig;
	labels: Array<string>;
}

export function HumidityGraph({ records, config, labels }: HumidityGraphProps) {
	return (
		<ValueGraph
			title="Humidity"
			suffix="%"
			color="#4ECDC4"
			labels={labels}
			min={config.HUMIDITY_MIN}
			max={config.HUMIDITY_MAX}
			graphMin={config.GRAPH_HUMIDITY_MIN}
			graphMax={config.GRAPH_HUMIDITY_MAX}
			data={records.map(({ humidity }) => humidity)}
		/>
	);
}
