import { PoweroffOutlined } from '@ant-design/icons';
import { Button, theme } from 'antd';

const { useToken } = theme;

interface OutletButtonProps {
	isOn: boolean;
	onClick: () => void;
	disabled?: boolean;
}

export function OutletButton({ isOn, onClick, disabled }: OutletButtonProps) {
	const { token } = useToken();

	return (
		<Button
			type="primary"
			shape="circle"
			size="large"
			onClick={onClick}
			disabled={disabled}
			style={{
				width: 64,
				height: 64,
				backgroundColor: isOn ? token.colorSuccess : token.colorFillSecondary,
				boxShadow: isOn
					? `0 0 15px ${token.colorSuccessActive}, inset 0 0 10px ${token.colorSuccessText}`
					: 'inset 0 0 5px rgba(0,0,0,0.2)',
				border: 'none',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
			}}
		>
			<PoweroffOutlined
				style={{
					fontSize: 24,
					color: isOn ? '#fff' : token.colorTextDisabled,
					textShadow: isOn ? '0 0 5px rgba(255,255,255,0.5)' : 'none',
				}}
			/>
		</Button>
	);
}
