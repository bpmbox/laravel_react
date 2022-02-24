import storageService from '../storage';

const LAST_SPACE_LOCALSTORAGE_KEY = 'lastSpace';
const LAST_CHAT_CONVERSATION_LOCALSTORAGE_KEY = 'lastChatConversation';

/**
 * Service that tracks visits to specific routes and saves last visited.
 */
export class TrackingService implements NSTrackingService.ITrackingService {
    __storageService: NSStorageService.StorageServiceType;

    // eslint-disable-next-line no-shadow
    constructor(storageService: NSStorageService.StorageServiceType) {
        // Dependency inject localstorage for unit testing.
        this.__storageService = storageService;
    }

    _getUserLastChatConversationKey(userId: string, spaceId: string) {
        return `${LAST_CHAT_CONVERSATION_LOCALSTORAGE_KEY}_${userId}_${spaceId}`;
    }

    _getUserLastSpaceKey(userId: string) {
        return `${LAST_SPACE_LOCALSTORAGE_KEY}_${userId}`;
    }

    /**
     * Set last visited space.
     */
    async reportSpaceVisit(currentUserId: string, space: Space): Promise<void> {
        const lastSpaceStr = JSON.stringify(space);
        const key = this._getUserLastSpaceKey(currentUserId);

        await this.__storageService.setItem(key, lastSpaceStr);
    }

    /**
     * Get last visited space reported.
     */
    async getLastVisitedSpace(currentUserId: string): Promise<Space | null> {
        const key = this._getUserLastSpaceKey(currentUserId);
        const savedSpaceString = await Promise.resolve(this.__storageService.getItem(key));

        if (!savedSpaceString) {
            return null;
        }

        return JSON.parse(savedSpaceString);
    }

    /**
     * Removes the last visited space reported, if any.
     */
    async removeLastVisitedSpace(currentUserId: string): Promise<boolean> {
        const key = this._getUserLastSpaceKey(currentUserId);
        await Promise.resolve(this.__storageService.removeItem(key));
        return true;
    }

    /**
     * Get last chat conversation viewed for the given user and space.
     */
    async reportChatConversationVisit(currentUserId: string, spaceId: string, conversationId: string): Promise<void> {
        const key = this._getUserLastChatConversationKey(currentUserId, spaceId);
        await this.__storageService.setItem(key, conversationId);
    }

    /**
     * Get last chat conversation viewed for the given user and space.
     */
    async getLastVisitedChatConversation(currentUserId: string, spaceId: string): Promise<string | null> {
        const key = this._getUserLastChatConversationKey(currentUserId, spaceId);
        const savedConversationString = await Promise.resolve(this.__storageService.getItem(key));
        if (!savedConversationString) {
            return null;
        }
        return savedConversationString;
    }

    /**
     * Removes the last visited chat conversation reported, if any.
     */
    async removeLastVisitedChatConversation(currentUserId: string, spaceId: string): Promise<boolean> {
        const key = this._getUserLastChatConversationKey(currentUserId, spaceId);
        await Promise.resolve(this.__storageService.removeItem(key));
        return true;
    }
}

const trackingService = new TrackingService(storageService);
export default trackingService;
