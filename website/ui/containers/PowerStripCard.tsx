import { Card, Flex, Skeleton, Typography } from 'antd';
import { sendOutletState } from 'api/socket';
import { useAtomValue } from 'jotai';
import { outletStateAtom } from 'store/outlets';
import { OutletButton } from 'ui/primitives/OutletButton';

const { Text } = Typography;

export function PowerStripCard() {
	const outletState = useAtomValue(outletStateAtom);

	const handleToggle = (slot: number) => {
		const currentState = outletState[slot]?.isOn ?? false;
		sendOutletState(slot, !currentState);
	};

	const renderOutlet = (slot: number) => {
		const status = outletState[slot];
		const isOn = status?.isOn ?? false;

		return (
			<Flex vertical align="center" gap="small" key={slot}>
				<Text type="secondary" style={{ fontSize: 12 }}>
					Socket {slot}
				</Text>
				<OutletButton isOn={isOn} onClick={() => handleToggle(slot)} disabled={!status} />
				{status ? (
					<Flex vertical align="center" gap={2}>
						<Text strong style={{ color: isOn ? '#52c41a' : undefined }}>
							{status.activePower.toFixed(1)} W
						</Text>
						<Text type="secondary" style={{ fontSize: 10 }}>
							{status.voltage.toFixed(0)} V
						</Text>
						<Text type="secondary" style={{ fontSize: 10 }}>
							{status.current.toFixed(2)} A
						</Text>
					</Flex>
				) : (
					<Skeleton.Button active size="small" style={{ width: 40, marginTop: 8 }} />
				)}
			</Flex>
		);
	};

	return (
		<Card title="Power Strip" size="small">
			<Flex justify="space-around" align="start">
				{[1, 2, 3, 4].map((slot) => renderOutlet(slot))}
			</Flex>
		</Card>
	);
}
