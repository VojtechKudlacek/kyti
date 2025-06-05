import { Col, Row, Statistic } from 'antd';

interface CurrentStateProps {
	temperature: string;
	humidity: string;
}

export function CurrentState({ temperature, humidity }: CurrentStateProps) {
	return (
		<Row>
			<Col span={12} style={{ textAlign: 'center' }}>
				<Statistic title="Temperature" value={temperature} valueStyle={{ color: '#FF6B6B' }} />
			</Col>
			<Col span={12} style={{ textAlign: 'center' }}>
				<Statistic title="Humidity" value={humidity} valueStyle={{ color: '#4ECDC4' }} />
			</Col>
		</Row>
	);
}
