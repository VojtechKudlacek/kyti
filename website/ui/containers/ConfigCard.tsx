import { Button, Card } from 'antd';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { configAtom } from 'store/config';
import { ConfigTable } from 'ui/components/ConfigTable';
import { ConfigEditModal } from 'ui/containers/ConfigEditModal';

export function ConfigCard() {
	const config = useAtomValue(configAtom);
	const [open, setOpen] = useState(false);

	if (!config) {
		return null;
	}

	return (
		<Card
			size="small"
			title="Config Overview"
			extra={
				<Button color="primary" variant="link" onClick={() => setOpen(true)}>
					Edit
				</Button>
			}
		>
			<ConfigTable config={config} />
			{open && <ConfigEditModal onClose={() => setOpen(false)} />}
		</Card>
	);
}
