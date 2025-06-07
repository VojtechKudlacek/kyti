import { Card, message } from 'antd';
import { ApiError } from 'api/ApiError';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { configAtom, updateConfigAtom } from 'store/config';
import type { ApiConfig } from 'types';
import { ConfigEditModal } from 'ui/components/ConfigEditModal';
import { ConfigTable } from 'ui/components/ConfigTable';

export function ConfigCard() {
	const [messageApi, messageApiContext] = message.useMessage();
	const config = useAtomValue(configAtom);
	const updateConfig = useSetAtom(updateConfigAtom);
	const [editKey, setEditKey] = useState<keyof ApiConfig | null>(null);

	const onChangeHandler = useCallback(
		async function (key: keyof ApiConfig, value: ApiConfig[keyof ApiConfig]) {
			try {
				await updateConfig([key, value]);
				messageApi.success('Config updated');
				setEditKey(null);
			} catch (error) {
				if (error instanceof ApiError) {
					messageApi.error(`Failed to update config: ${error.message}`);
					return;
				}
				messageApi.error('Unknown error');
				setEditKey(null);
			}
		},
		[updateConfig, messageApi],
	);

	if (!config) {
		return null;
	}

	return (
		<Card size="small" title="Config Overview">
			<ConfigTable config={config} onEdit={setEditKey} />
			{editKey && (
				<ConfigEditModal
					configKey={editKey}
					configValue={config[editKey]}
					onCancel={() => setEditKey(null)}
					onChange={onChangeHandler}
				/>
			)}
			{messageApiContext}
		</Card>
	);
}
