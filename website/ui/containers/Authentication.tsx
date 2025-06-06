import { Input, Modal } from 'antd';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { secretAtom } from 'store/secret';
import { AuthButton } from 'ui/primitives/AuthButton';

export function Authentication() {
	const [inputValue, setInputValue] = useState('');
	const [secret, setSecret] = useAtom(secretAtom);
	const [open, setOpen] = useState(false);

	function okHandler() {
		setOpen(false);
		setSecret(inputValue);
		setInputValue('');
	}

	function cancelHandler() {
		setOpen(false);
		setInputValue('');
	}

	function authButtonClickHandler() {
		if (secret) {
			setSecret(null);
			return;
		}
		setOpen(true);
	}

	return (
		<>
			<AuthButton onClick={authButtonClickHandler} isLoggedIn={secret !== null} />
			<Modal
				title="Enter secret"
				open={open}
				onOk={okHandler}
				onCancel={cancelHandler}
				okButtonProps={{ disabled: inputValue.length === 0 }}
			>
				<Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter secret" />
			</Modal>
		</>
	);
}
