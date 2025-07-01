import { Card, Skeleton } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';
import { configAtom, updateConfigAtom } from 'store/config';
import { ModeSelect } from 'ui/primitives/ModeSelect';

export function ModeCard() {
	const config = useAtomValue(configAtom);
	const updateConfig = useSetAtom(updateConfigAtom);

	return (
		<Card title="Mode" size="small">
			{config ? (
				<ModeSelect value={config.MODE} onChange={(value) => updateConfig(['MODE', value])} />
			) : (
				<Skeleton active />
			)}
		</Card>
	);
}
