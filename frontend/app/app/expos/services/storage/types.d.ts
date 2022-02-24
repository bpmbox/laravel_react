declare namespace NSStorageService {
    interface StorageServiceType {
        setItem: (key: string, value: string) => Promise<void>;
        getItem: (key: string) => Promise<null | string | undefined>;
        removeItem: (key: string) => Promise<void>;
    }
}
