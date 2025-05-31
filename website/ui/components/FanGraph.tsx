import type { ApiRecord } from 'types';
import { OnOffGraph } from 'ui/primitives/OnOffGraph';

interface FanGraphProps {
	records: Array<ApiRecord>;
	labels: Array<string>;
}

export function FanGraph({ records, labels }: FanGraphProps) {
	return (
		<OnOffGraph
			title="Fan"
			color="#E17055"
			labels={labels}
			data={records.map(({ ventilator }) => (ventilator ? 1 : 0))}
		/>
	);
}
