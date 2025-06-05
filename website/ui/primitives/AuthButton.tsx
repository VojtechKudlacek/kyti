import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

interface AuthButtonProps {
	onClick: () => void;
	isLoggedIn: boolean;
}

export function AuthButton({ onClick, isLoggedIn }: AuthButtonProps) {
	return <FloatButton onClick={onClick} icon={isLoggedIn ? <LogoutOutlined /> : <UserOutlined />} />;
}
