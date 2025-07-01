import { Form, Input, type InputRef, Modal } from 'antd';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { secretAtom } from 'store/secret';
import { AuthButton } from 'ui/primitives/AuthButton';

interface FormValues {
	SECRET: string;
}

export function Authentication() {
	const [secret, setSecret] = useAtom(secretAtom);
	const [open, setOpen] = useState(false);
	const inputRef = useRef<InputRef>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		function keyDownHandler(e: KeyboardEvent) {
			if (e.key === 'Enter') {
				form.submit();
			}
		}
		window.addEventListener('keydown', keyDownHandler);
		return () => window.removeEventListener('keydown', keyDownHandler);
	}, [form]);

	function cancelHandler() {
		setOpen(false);
		form.resetFields();
	}

	function authButtonClickHandler() {
		if (secret) {
			setSecret(null);
			return;
		}
		setOpen(true);
		setTimeout(() => {
			// Doesn't work without a slight delay
			inputRef.current?.focus();
		}, 100);
	}

	function formSubmitHandler(formValues: FormValues) {
		setSecret(formValues.SECRET);
		form.resetFields();
		setOpen(false);
	}

	function okHandler() {
		form.submit();
	}

	return (
		<>
			<AuthButton onClick={authButtonClickHandler} isLoggedIn={secret !== null} />
			<Modal title="Admin Zone" open={open} onOk={okHandler} onCancel={cancelHandler}>
				<Form form={form} onFinish={formSubmitHandler} layout="horizontal" requiredMark="optional">
					<Form.Item<FormValues>
						label="Secret"
						name="SECRET"
						rules={[{ required: true, message: 'Please enter a secret!' }]}
					>
						<Input ref={inputRef} placeholder="Enter secret" />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}
