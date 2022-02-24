import { useReducer, useEffect } from 'react';
import { DateTime } from 'luxon';
import { createContainer } from 'unstated-next';
import messageService, { MESSAGE_EVENT } from '../../services/message';
import { MessageType } from '../../types/enums';

const _initMsgState: MsgStateType = {
    type: 'MESSAGE',
    msg: '',
    title: '',
    time: DateTime.local(),
};

export function useMsgStore(initMsgState: MsgStateType = _initMsgState) {
    const [state, setState] = useReducer((oldState, newState) => ({ ...oldState, ...newState }), initMsgState);

    const setMsg = (msg: string, type: MessageType, title: string) => {
        return setState({ msg, type, time: DateTime.local(), title });
    };

    useEffect(() => {
        messageService.addListener(MESSAGE_EVENT, messagePayload => {
            setMsg(messagePayload.message, messagePayload.type, messagePayload.title);
        });

        return () => {
            messageService.removeListener(MESSAGE_EVENT, setMsg);
        };
    }, []);

    return {
        currentMsg: state,
    };
}

export default createContainer(useMsgStore);
