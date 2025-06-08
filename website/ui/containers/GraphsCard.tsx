import { Card, Skeleton } from 'antd';
import { format } from 'date-fns';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { configAtom } from 'store/config';
import { average30RecordsAtom, fetchRecordsAtom, minutesToRenderAtom } from 'store/records';
import { ClimateGraph } from 'ui/components/ClimateGraph';
import { FanGraph } from 'ui/components/FanGraph';
import { HumidifierGraph } from 'ui/components/HumidifierGraph';
import { LightGraph } from 'ui/components/LightGraph';
import { VentilatorGraph } from 'ui/components/VentilatorGraph';
import { RenderTimeSelect } from 'ui/primitives/RenderTimeSelect';

export function GraphsCard() {
	const config = useAtomValue(configAtom);
	const records = useAtomValue(average30RecordsAtom);
	const fetchRecords = useSetAtom(fetchRecordsAtom);
	const [minutesToRender, setMinutesToRender] = useAtom(minutesToRenderAtom);

	const labels = useMemo(() => records.map(({ timestamp }) => format(timestamp, 'HH:mm')), [records]);

	function changeTimeToRenderHandler(newValue: number) {
		setMinutesToRender(newValue);
		fetchRecords();
	}

	return (
		<Card
			title="Graphs"
			size="small"
			extra={<RenderTimeSelect value={minutesToRender} onChange={changeTimeToRenderHandler} />}
		>
			{config ? (
				<>
					<ClimateGraph records={records} config={config} labels={labels} />
					<LightGraph records={records} labels={labels} />
					<VentilatorGraph records={records} labels={labels} />
					<HumidifierGraph records={records} labels={labels} />
					<FanGraph records={records} labels={labels} />
				</>
			) : (
				<Skeleton active />
			)}
		</Card>
	);
}
