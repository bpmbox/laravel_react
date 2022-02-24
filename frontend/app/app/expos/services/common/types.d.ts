declare namespace CommonServiceTypes {
    interface ICommonService {
        getImageFormat: (fileName: string) => string;
        getMaxUploadFileSize: () => Number;
        getPostUrl: (fileName: string, contentType?: string) => Promise<UploadUrlData>;
        uploadImage: (image: Blob | File | string) => Promise<string>;
    }

    interface IResizedImage {
        data?: Blob;
        dataUri?: string;
        height: number;
        name: string;
        path: string;
        size: number;
        uri: string;
        width: number;
    }
}
