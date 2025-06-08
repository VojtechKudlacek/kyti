import { message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import { type PropsWithChildren, createContext } from 'react';

export const MessageContext = createContext<MessageInstance | null>(null);

export function MessageProvider({ children }: PropsWithChildren) {
	const [messageApi, messageApiContext] = message.useMessage();
	return (
		<MessageContext.Provider value={messageApi}>
			{children}
			{messageApiContext}
		</MessageContext.Provider>
	);
}
