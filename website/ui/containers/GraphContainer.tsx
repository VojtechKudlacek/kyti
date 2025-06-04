import { Card } from 'antd';
import { format } from 'date-fns';
import { useAtomValue } from 'jotai';
import { configAtom } from 'store/config';
import { recordsAtom } from 'store/records';
import { ClimateGraph } from 'ui/components/ClimateGraph';
import { FanGraph } from 'ui/components/FanGraph';
import { HumidifierGraph } from 'ui/components/HumidifierGraph';
import { LightGraph } from 'ui/components/LightGraph';
import { VentilatorGraph } from 'ui/components/VentilatorGraph';

export function GraphContainer() {
	const records = useAtomValue(recordsAtom);
	const config = useAtomValue(configAtom);
	const labels = records.map(({ timestamp }) => format(timestamp, 'HH:mm'));

	if (!config) {
		return null;
	}

	return (
		<Card title="Graphs" size="small">
			<ClimateGraph records={records} config={config} labels={labels} />
			<LightGraph records={records} labels={labels} />
			<VentilatorGraph records={records} labels={labels} />
			<HumidifierGraph records={records} labels={labels} />
			<FanGraph records={records} labels={labels} />
		</Card>
	);
}
