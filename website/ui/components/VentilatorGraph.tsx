import type { ApiRecord } from 'types';
import { OnOffGraph } from 'ui/primitives/OnOffGraph';

interface VentilatorGraphProps {
	records: Array<ApiRecord>;
	labels: Array<string>;
}

export function VentilatorGraph({ records, labels }: VentilatorGraphProps) {
	return (
		<OnOffGraph
			title="Ventilator"
			color="#6C5CE7"
			labels={labels}
			data={records.map(({ ventilator }) => (ventilator ? 1 : 0))}
		/>
	);
}
