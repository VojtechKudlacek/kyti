import { Card } from 'antd';
import { useAtomValue } from 'jotai';
import { configAtom } from 'store/config';
import { ConfigOverview } from 'ui/components/ConfigOverview';

export function ConfigCard() {
	const config = useAtomValue(configAtom);

	if (!config) {
		return null;
	}

	return (
		<Card size="small" title="Config Overview">
			<ConfigOverview config={config} />
		</Card>
	);
}
