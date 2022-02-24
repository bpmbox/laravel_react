import { EventEmitter } from 'events';
import { MessageType } from '../../types/enums';

export const MESSAGE_EVENT = 'MESSAGE_EVENT';
/**
 * MessageService is a global service for general alerts.  This service emits events, which is consumed by <Messaging> component
 * which is subscribed to this service's event stream.
 */
export class MessageService extends EventEmitter implements MessageServiceTypes.IMessageService {
    sendMessage(message: string, title?: string) {
        const messagePayload: MessageServiceTypes.IMessageEventPayload = {
            title,
            message,
            type: MessageType.MESSAGE,
        };
        this.emit(MESSAGE_EVENT, messagePayload);
    }

    sendSuccess(message: string, title?: string) {
        const messagePayload: MessageServiceTypes.IMessageEventPayload = {
            title,
            message,
            type: MessageType.SUCCESS,
        };
        this.emit(MESSAGE_EVENT, messagePayload);
    }

    sendError(message: string, title?: string) {
        const messagePayload: MessageServiceTypes.IMessageEventPayload = {
            title,
            message,
            type: MessageType.ERROR,
        };
        this.emit(MESSAGE_EVENT, messagePayload);
    }

    sendWarning(message: string, title?: string) {
        const messagePayload: MessageServiceTypes.IMessageEventPayload = {
            title,
            message,
            type: MessageType.WARNING,
        };
        this.emit(MESSAGE_EVENT, messagePayload);
    }
}

const messageService = new MessageService();
export default messageService;
