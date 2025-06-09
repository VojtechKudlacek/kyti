import { Select } from 'antd';

interface RenderRecordSelectProps {
	value: number;
	onChange: (value: number) => void;
}

export function RenderRecordSelect({ value, onChange }: RenderRecordSelectProps) {
	return (
		<Select
			size="small"
			value={value.toString()}
			onChange={(newValue) => onChange(Number.parseInt(newValue, 10))}
			style={{ width: 120 }}
			options={[
				{ value: '15', label: '15 records' },
				{ value: '30', label: '30 records' },
				{ value: '60', label: '60 records' },
			]}
		/>
	);
}
