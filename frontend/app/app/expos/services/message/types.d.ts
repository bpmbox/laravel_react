declare namespace MessageServiceTypes {
    interface IMessageService {
        sendMessage: (message: string, title?: string) => void;
        sendSuccess: (message: string, title?: string) => void;
        sendError: (message: string, title?: string) => void;
        sendWarning: (message: string, title?: string) => void;
    }

    interface IMessageEventPayload {
        title?: string;
        message: string;
        type: MessageType;
    }
}
