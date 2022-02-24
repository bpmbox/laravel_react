import AsyncStorage, { AsyncStorageStatic } from '@react-native-community/async-storage';

class StorageService {
    __storage: AsyncStorageStatic;

    constructor() {
        this.__storage = AsyncStorage;
    }

    async getItem(key: string) {
        try {
            return await this.__storage.getItem(key);
        } catch (e) {
            // ignore error - common situation.
        }
    }

    async setItem(key: string, value: string) {
        try {
            await this.__storage.setItem(key, value);
        } catch (e) {
            console.error(e);
        }
    }

    async removeItem(key: string) {
        try {
            await this.__storage.removeItem(key);
        } catch (e) {
            // ignore error - common situation.
        }
    }
}

const storageService: NSStorageService.StorageServiceType = new StorageService();
export default storageService;
