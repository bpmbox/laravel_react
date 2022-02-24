import { MessageService, MESSAGE_EVENT } from '.';
import { MessageType } from '../../types/enums';

describe('MessageService', () => {
    it('should emit event corresponding to the action type.', () => {
        const listener = jest.fn();

        const messageService = new MessageService();
        messageService.addListener(MESSAGE_EVENT, listener);

        messageService.sendMessage('Bar', 'Foo');
        expect(listener).toBeCalledWith({
            title: 'Foo',
            message: 'Bar',
            type: MessageType.MESSAGE,
        });

        messageService.sendSuccess('Horay', 'HipHip');
        expect(listener).toBeCalledWith({
            title: 'HipHip',
            message: 'Horay',
            type: MessageType.SUCCESS,
        });

        messageService.sendError('Check2', 'Check1');
        expect(listener).toBeCalledWith({
            title: 'Check1',
            message: 'Check2',
            type: MessageType.ERROR,
        });

        messageService.sendWarning('Check2', 'Check1');
        expect(listener).toBeCalledWith({
            title: 'Check1',
            message: 'Check2',
            type: MessageType.WARNING,
        });
    });

    it('should use message type as title if title not provided.', () => {
        // Note: the title will be undefined, and will be up to the MessageToast component to
        // render the default title.
        const listener = jest.fn();

        const messageService = new MessageService();
        messageService.addListener(MESSAGE_EVENT, listener);

        messageService.sendMessage('Bar');
        expect(listener).toBeCalledWith({
            title: undefined,
            message: 'Bar',
            type: MessageType.MESSAGE,
        });

        messageService.sendSuccess('Horay');
        expect(listener).toBeCalledWith({
            title: undefined,
            message: 'Horay',
            type: MessageType.SUCCESS,
        });

        messageService.sendError('Check2');
        expect(listener).toBeCalledWith({
            title: undefined,
            message: 'Check2',
            type: MessageType.ERROR,
        });

        messageService.sendWarning('Check2');
        expect(listener).toBeCalledWith({
            title: undefined,
            message: 'Check2',
            type: MessageType.WARNING,
        });
    });
});
