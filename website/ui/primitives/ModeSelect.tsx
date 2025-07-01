import { Select } from 'antd';
import type { ApiConfig } from 'types';

interface ModeSelectProps {
	value: ApiConfig['MODE'];
	onChange: (value: ApiConfig['MODE']) => void;
}

export function ModeSelect({ value, onChange }: ModeSelectProps) {
	return (
		<Select
			size="small"
			value={value}
			onChange={onChange}
			style={{ width: 120 }}
			options={[
				{ value: 'GROW', label: 'Grow' },
				{ value: 'DRY', label: 'Dry' },
				{ value: 'OFF', label: 'Off' },
			]}
		/>
	);
}
