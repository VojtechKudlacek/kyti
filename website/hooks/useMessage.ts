import { useContext } from 'react';
import { MessageContext } from 'ui/containers/MessageProvider';

export const useMessage = () => useContext(MessageContext);
