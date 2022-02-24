/* istanbul ignore file */
// These codes are restructured from Sendbird examples, it's hard to test for now
// TODO: Will cover test for this file later

import { BaseChatService } from './base';

class ChatService extends BaseChatService {
    // empty
}

const chatService = new ChatService();
export default chatService;

export const appClosedMessageHandler = async _message => {
    // nothing to do on web
    return Promise.resolve();
};

export { CHAT_EVENTS, STUB_USER } from './base';
