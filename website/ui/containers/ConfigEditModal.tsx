import { Form, Modal, Radio, Select, Slider, Switch, TimePicker } from 'antd';
import { ApiError } from 'api/ApiError';
import dayjs from 'dayjs';
import { useMessage } from 'hooks/useMessage';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { configAtom, updateConfigAtom } from 'store/config';
import type { ApiConfig } from 'types';

interface FormValues {
	TEMPERATURE: [number, number];
	HUMIDITY: [number, number];
	OUTLET_SLOT_LIGHT: number;
	OUTLET_SLOT_VENTILATOR: number;
	OUTLET_SLOT_FAN: number;
	OUTLET_SLOT_HUMIDIFIER: number;
	TASK_CLIMATE_LOG: boolean;
	TASK_LOG_BROOM: boolean;
	GRAPH_TEMPERATURE: [number, number];
	GRAPH_HUMIDITY: [number, number];
	LOG_LIFESPAN: number;
	RECORD_LIFESPAN: number;
	LIGHT_TURN_ON_TIME: dayjs.Dayjs;
	LIGHT_TURN_OFF_TIME: dayjs.Dayjs;
	FAN_TURN_ON_TIME: dayjs.Dayjs;
	FAN_TURN_OFF_TIME: dayjs.Dayjs;
}

interface ConfigEditModalProps {
	onClose: () => void;
}

export function ConfigEditModal({ onClose }: ConfigEditModalProps) {
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();
	const message = useMessage();
	const config = useAtomValue(configAtom);
	const updateConfig = useSetAtom(updateConfigAtom);

	if (!config) {
		return null;
	}

	async function changeConfig(key: keyof ApiConfig, value: ApiConfig[keyof ApiConfig]) {
		try {
			await updateConfig([key, value]);
			message?.success('Config updated');
		} catch (error) {
			if (error instanceof ApiError) {
				message?.error(`Failed to update config: ${error.message}`);
				return;
			}
			message?.error(`Unknown error: ${error}`);
		}
	}

	async function formSubmitHandler(formValues: FormValues) {
		if (!config) {
			return;
		}

		setLoading(true);
		const {
			TEMPERATURE,
			HUMIDITY,
			GRAPH_TEMPERATURE,
			GRAPH_HUMIDITY,
			LIGHT_TURN_ON_TIME,
			LIGHT_TURN_OFF_TIME,
			FAN_TURN_ON_TIME,
			FAN_TURN_OFF_TIME,
			...rest
		} = formValues;

		const formApiConfig: ApiConfig = {
			...config,
			...rest,
			TEMPERATURE_MIN: TEMPERATURE[0],
			TEMPERATURE_MAX: TEMPERATURE[1],
			HUMIDITY_MIN: HUMIDITY[0],
			HUMIDITY_MAX: HUMIDITY[1],
			GRAPH_TEMPERATURE_MIN: GRAPH_TEMPERATURE[0],
			GRAPH_TEMPERATURE_MAX: GRAPH_TEMPERATURE[1],
			GRAPH_HUMIDITY_MIN: GRAPH_HUMIDITY[0],
			GRAPH_HUMIDITY_MAX: GRAPH_HUMIDITY[1],
			LIGHT_TURN_ON_TIME: LIGHT_TURN_ON_TIME.format('HH:mm'),
			LIGHT_TURN_OFF_TIME: LIGHT_TURN_OFF_TIME.format('HH:mm'),
			FAN_TURN_ON_TIME: FAN_TURN_ON_TIME.format('HH:mm'),
			FAN_TURN_OFF_TIME: FAN_TURN_OFF_TIME.format('HH:mm'),
		};

		for (const key in config) {
			const originalValue = config[key as keyof ApiConfig];
			const newValue = formApiConfig[key as keyof ApiConfig];
			if (originalValue !== newValue) {
				await changeConfig(key as keyof ApiConfig, newValue);
			}
		}

		setLoading(false);
		onClose();
	}

	return (
		<Modal
			title="Edit config"
			open
			onOk={form.submit}
			onCancel={onClose}
			confirmLoading={loading}
			className="scrollable-modal"
		>
			<Form form={form} onFinish={formSubmitHandler} layout="horizontal" requiredMark="optional" labelCol={{ span: 8 }}>
				<Form.Item<FormValues>
					label="Temperature"
					name="TEMPERATURE"
					initialValue={[config.TEMPERATURE_MIN, config.TEMPERATURE_MAX]}
					rules={[{ required: true, message: 'Please select a temperature range!' }]}
				>
					<Slider
						range
						min={20}
						max={30}
						marks={{
							[config.TEMPERATURE_MIN]: `${config.TEMPERATURE_MIN}`,
							[config.TEMPERATURE_MAX]: `${config.TEMPERATURE_MAX}`,
							20: '20°C',
							30: '30°C',
						}}
					/>
				</Form.Item>

				<Form.Item<FormValues>
					label="Humidity"
					name="HUMIDITY"
					initialValue={[config.HUMIDITY_MIN, config.HUMIDITY_MAX]}
					rules={[{ required: true, message: 'Please select a humidity range!' }]}
				>
					<Slider
						range
						min={30}
						max={80}
						marks={{
							[config.HUMIDITY_MIN]: `${config.HUMIDITY_MIN}`,
							[config.HUMIDITY_MAX]: `${config.HUMIDITY_MAX}`,
							30: '30%',
							80: '80%',
						}}
					/>
				</Form.Item>

				<Form.Item<FormValues>
					label="Outlet slot light"
					name="OUTLET_SLOT_LIGHT"
					initialValue={config.OUTLET_SLOT_LIGHT}
					rules={[{ required: true, message: 'Please select a outlet slot for light!' }]}
				>
					<Radio.Group>
						<Radio.Button value={1}>1</Radio.Button>
						<Radio.Button value={2}>2</Radio.Button>
						<Radio.Button value={3}>3</Radio.Button>
						<Radio.Button value={4}>4</Radio.Button>
					</Radio.Group>
				</Form.Item>

				<Form.Item<FormValues>
					label="Outlet slot ventilator"
					name="OUTLET_SLOT_VENTILATOR"
					initialValue={config.OUTLET_SLOT_VENTILATOR}
					rules={[{ required: true, message: 'Please select a outlet slot for ventilator!' }]}
				>
					<Radio.Group>
						<Radio.Button value={1}>1</Radio.Button>
						<Radio.Button value={2}>2</Radio.Button>
						<Radio.Button value={3}>3</Radio.Button>
						<Radio.Button value={4}>4</Radio.Button>
					</Radio.Group>
				</Form.Item>

				<Form.Item<FormValues>
					label="Outlet slot fan"
					name="OUTLET_SLOT_FAN"
					initialValue={config.OUTLET_SLOT_FAN}
					rules={[{ required: true, message: 'Please select a outlet slot for fan!' }]}
				>
					<Radio.Group>
						<Radio.Button value={1}>1</Radio.Button>
						<Radio.Button value={2}>2</Radio.Button>
						<Radio.Button value={3}>3</Radio.Button>
						<Radio.Button value={4}>4</Radio.Button>
					</Radio.Group>
				</Form.Item>

				<Form.Item<FormValues>
					label="Outlet slot humidifier"
					name="OUTLET_SLOT_HUMIDIFIER"
					initialValue={config.OUTLET_SLOT_HUMIDIFIER}
					rules={[{ required: true, message: 'Please select a outlet slot for humidifier!' }]}
				>
					<Radio.Group>
						<Radio.Button value={1}>1</Radio.Button>
						<Radio.Button value={2}>2</Radio.Button>
						<Radio.Button value={3}>3</Radio.Button>
						<Radio.Button value={4}>4</Radio.Button>
					</Radio.Group>
				</Form.Item>

				<Form.Item<FormValues>
					label="Climate log task"
					name="TASK_CLIMATE_LOG"
					initialValue={config.TASK_CLIMATE_LOG}
					rules={[{ required: true, message: 'Please select a climate log task on/off!' }]}
				>
					<Switch />
				</Form.Item>

				<Form.Item<FormValues>
					label="Log broom task"
					name="TASK_LOG_BROOM"
					initialValue={config.TASK_LOG_BROOM}
					rules={[{ required: true, message: 'Please select a log broom task on/off!' }]}
				>
					<Switch />
				</Form.Item>

				<Form.Item<FormValues>
					label="Graph temperature"
					name="GRAPH_TEMPERATURE"
					initialValue={[config.GRAPH_TEMPERATURE_MIN, config.GRAPH_TEMPERATURE_MAX]}
					rules={[{ required: true, message: 'Please select a graph temperature range!' }]}
				>
					<Slider
						range
						min={18}
						max={32}
						marks={{
							[config.GRAPH_TEMPERATURE_MIN]: `${config.GRAPH_TEMPERATURE_MIN}`,
							[config.GRAPH_TEMPERATURE_MAX]: `${config.GRAPH_TEMPERATURE_MAX}`,
							18: '18°C',
							32: '32°C',
						}}
					/>
				</Form.Item>

				<Form.Item<FormValues>
					label="Graph humidity"
					name="GRAPH_HUMIDITY"
					initialValue={[config.GRAPH_HUMIDITY_MIN, config.GRAPH_HUMIDITY_MAX]}
					rules={[{ required: true, message: 'Please select a graph humidity range!' }]}
				>
					<Slider
						range
						min={20}
						max={90}
						marks={{
							[config.GRAPH_HUMIDITY_MIN]: `${config.GRAPH_HUMIDITY_MIN}`,
							[config.GRAPH_HUMIDITY_MAX]: `${config.GRAPH_HUMIDITY_MAX}`,
							20: '20%',
							90: '90%',
						}}
					/>
				</Form.Item>

				<Form.Item<FormValues>
					label="Log life span"
					name="LOG_LIFESPAN"
					initialValue={config.LOG_LIFESPAN}
					rules={[{ required: true, message: 'Please select a log life span!' }]}
				>
					<Select
						options={[
							{ value: 24, label: '1 day' },
							{ value: 48, label: '2 days' },
							{ value: 72, label: '3 days' },
							{ value: 96, label: '4 days' },
							{ value: 120, label: '5 days' },
							{ value: 144, label: '6 days' },
							{ value: 168, label: '1 week' },
						]}
					/>
				</Form.Item>

				<Form.Item<FormValues>
					label="Record life span"
					name="RECORD_LIFESPAN"
					initialValue={config.RECORD_LIFESPAN}
					rules={[{ required: true, message: 'Please select a record life span!' }]}
				>
					<Select
						options={[
							{ value: 24, label: '1 day' },
							{ value: 48, label: '2 days' },
							{ value: 72, label: '3 days' },
							{ value: 96, label: '4 days' },
							{ value: 120, label: '5 days' },
							{ value: 144, label: '6 days' },
							{ value: 168, label: '1 week' },
						]}
					/>
				</Form.Item>

				<Form.Item<FormValues>
					label="Light turn on time"
					name="LIGHT_TURN_ON_TIME"
					initialValue={dayjs(config.LIGHT_TURN_ON_TIME, 'HH:mm')}
					rules={[{ required: true, message: 'Please select a light turn on time!' }]}
				>
					<TimePicker format="HH:mm" />
				</Form.Item>

				<Form.Item<FormValues>
					label="Light turn off time"
					name="LIGHT_TURN_OFF_TIME"
					initialValue={dayjs(config.LIGHT_TURN_OFF_TIME, 'HH:mm')}
					rules={[{ required: true, message: 'Please select a light turn off time!' }]}
				>
					<TimePicker format="HH:mm" />
				</Form.Item>

				<Form.Item<FormValues>
					label="Fan turn on time"
					name="FAN_TURN_ON_TIME"
					initialValue={dayjs(config.FAN_TURN_ON_TIME, 'HH:mm')}
					rules={[{ required: true, message: 'Please select a fan turn on time!' }]}
				>
					<TimePicker format="HH:mm" />
				</Form.Item>

				<Form.Item<FormValues>
					label="Fan turn off time"
					name="FAN_TURN_OFF_TIME"
					initialValue={dayjs(config.FAN_TURN_OFF_TIME, 'HH:mm')}
					rules={[{ required: true, message: 'Please select a fan turn off time!' }]}
				>
					<TimePicker format="HH:mm" />
				</Form.Item>
			</Form>
		</Modal>
	);
}
