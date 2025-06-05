import type { ApiRecord } from 'types';
import { OnOffGraph } from 'ui/components/OnOffGraph';

interface FanGraphProps {
	records: Array<ApiRecord>;
	labels: Array<string>;
}

export function FanGraph({ records, labels }: FanGraphProps) {
	return <OnOffGraph title="Fan" color="#E17055" labels={labels} data={records.map(({ fan }) => (fan ? 1 : 0))} />;
}
