import { Input, InputNumber, Modal, Switch } from 'antd';
import { useState } from 'react';
import type { ApiConfig } from 'types';

interface ConfigEditModalProps<K extends keyof ApiConfig> {
	configKey: K;
	configValue: ApiConfig[K];
	onCancel: () => void;
	onChange: (key: K, value: ApiConfig[K]) => Promise<void>;
}

export function ConfigEditModal<K extends keyof ApiConfig>({
	configKey,
	configValue,
	onCancel,
	onChange,
}: ConfigEditModalProps<K>) {
	const [loading, setLoading] = useState(false);
	const [value, setValue] = useState<ApiConfig[K] | null>(configValue);

	async function okHandler() {
		if (value === null) {
			return;
		}
		setLoading(true);
		await onChange(configKey, value);
		setLoading(false);
	}

	return (
		<Modal title="Enter secret" open onOk={okHandler} onCancel={onCancel} confirmLoading={loading}>
			{typeof value === 'number' ? (
				<InputNumber value={value} onChange={setValue} style={{ width: '100%' }} />
			) : typeof value === 'boolean' ? (
				<Switch checked={value} onChange={(newValue: boolean) => setValue(newValue as ApiConfig[K])} />
			) : typeof value === 'string' ? (
				<Input value={value} onChange={console.info} />
			) : null}
		</Modal>
	);
}
