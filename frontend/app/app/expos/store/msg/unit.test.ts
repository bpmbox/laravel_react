import { renderHook } from '@testing-library/react-hooks';
import sinon, { SinonSandbox } from 'sinon';
import { useMsgStore } from '.';
import messageService from '../../services/message';
import { MessageType } from '../../types/enums';

describe('MsgStore', (): void => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('it should set current message with right type when calling setError, setMessage, setSuccess', async (): Promise<
        void
    > => {
        let listener: Function | null = null;
        sandbox.stub(messageService, 'addListener').callsFake((_evt, evtListener): any => {
            listener = evtListener;
        });
        const { result, rerender } = renderHook(() => useMsgStore());

        // Await end of proise queue to allow useEffect() to complete
        await new Promise(resolve => {
            setImmediate(() => resolve());
        });

        if (!listener) {
            return fail('listener not set');
        }

        (listener as (m: MessageServiceTypes.IMessageEventPayload) => void)({
            title: 'Error',
            message: 'This is an error',
            type: MessageType.ERROR,
        });
        rerender();
        expect(result.current.currentMsg).toMatchObject({
            msg: 'This is an error',
            type: MessageType.ERROR,
        });

        (listener as (m: MessageServiceTypes.IMessageEventPayload) => void)({
            title: 'Message',
            message: 'This is a message',
            type: MessageType.MESSAGE,
        });
        rerender();
        expect(result.current.currentMsg).toMatchObject({
            msg: 'This is a message',
            type: MessageType.MESSAGE,
        });

        (listener as (m: MessageServiceTypes.IMessageEventPayload) => void)({
            title: 'Success',
            message: 'This is a success',
            type: MessageType.SUCCESS,
        });
        rerender();
        expect(result.current.currentMsg).toMatchObject({
            msg: 'This is a success',
            type: MessageType.SUCCESS,
        });
    });
});
