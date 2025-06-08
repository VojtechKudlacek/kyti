import { Select } from 'antd';

interface RenderTimeSelectProps {
	value: number;
	onChange: (value: number) => void;
}

export function RenderTimeSelect({ value, onChange }: RenderTimeSelectProps) {
	return (
		<Select
			size="small"
			value={value.toString()}
			onChange={(newValue) => onChange(Number.parseInt(newValue, 10))}
			style={{ width: 120 }}
			options={[
				{ value: '30', label: '30 minutes' },
				{ value: '60', label: '1 hour' },
				{ value: '120', label: '2 hours' },
				{ value: '240', label: '4 hours' },
				{ value: '480', label: '8 hours' },
				{ value: '720', label: '12 hours' },
				{ value: '1440', label: '1 day' },
			]}
		/>
	);
}
