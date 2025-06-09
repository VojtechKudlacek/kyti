import { Card, Flex, Skeleton } from 'antd';
import { useGraphRecordsAndLabels } from 'hooks/useGraphRecordsAndLabels';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { configAtom } from 'store/config';
import { fetchRecordsAtom, minutesToRenderAtom, recordsToRenderAtom } from 'store/records';
import { ClimateGraph } from 'ui/components/ClimateGraph';
import { FanGraph } from 'ui/components/FanGraph';
import { HumidifierGraph } from 'ui/components/HumidifierGraph';
import { LightGraph } from 'ui/components/LightGraph';
import { VentilatorGraph } from 'ui/components/VentilatorGraph';
import { RenderRecordSelect } from 'ui/primitives/RenderRecordSelect';
import { RenderTimeSelect } from 'ui/primitives/RenderTimeSelect';

export function GraphsCard() {
	const config = useAtomValue(configAtom);
	const fetchRecords = useSetAtom(fetchRecordsAtom);
	const [recordsToRender, setRecordsToRender] = useAtom(recordsToRenderAtom);
	const [minutesToRender, setMinutesToRender] = useAtom(minutesToRenderAtom);
	const [records, labels] = useGraphRecordsAndLabels();

	function changeTimeToRenderHandler(newValue: number) {
		setMinutesToRender(newValue);
		fetchRecords();
	}

	return (
		<Card
			title="Graphs"
			size="small"
			extra={
				<Flex gap={8}>
					<RenderRecordSelect value={recordsToRender} onChange={setRecordsToRender} />
					<RenderTimeSelect value={minutesToRender} onChange={changeTimeToRenderHandler} />
				</Flex>
			}
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
