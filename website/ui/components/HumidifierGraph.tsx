import type { ApiRecord } from 'types';
import { OnOffGraph } from 'ui/components/OnOffGraph';

interface HumidifierGraphProps {
	records: Array<ApiRecord>;
	labels: Array<string>;
}

export function HumidifierGraph({ records, labels }: HumidifierGraphProps) {
	return (
		<OnOffGraph
			title="Humidifier"
			color="#00B894"
			labels={labels}
			data={records.map(({ humidifier }) => (humidifier ? 1 : 0))}
		/>
	);
}
