class StorageService {
    __storage: Storage;

    constructor() {
        this.__storage = window.localStorage;
    }

    async getItem(key: string) {
        try {
            return this.__storage.getItem(key);
        } catch (e) {
            console.error(e);
        }
    }

    async setItem(key: string, value: string) {
        try {
            return this.__storage.setItem(key, value);
        } catch (e) {
            console.error(e);
        }
    }

    async removeItem(key: string) {
        try {
            await this.__storage.removeItem(key);
        } catch (e) {
            console.error(e);
        }
    }
}

const storageService: NSStorageService.StorageServiceType = new StorageService();
export default storageService;
