import type { ApiRecord } from 'types';
import { OnOffGraph } from 'ui/components/OnOffGraph';

interface LightGraphProps {
	records: Array<ApiRecord>;
	labels: Array<string>;
}

export function LightGraph({ records, labels }: LightGraphProps) {
	return (
		<OnOffGraph title="Light" color="#FFD700" labels={labels} data={records.map(({ light }) => (light ? 1 : 0))} />
	);
}
