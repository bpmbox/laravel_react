import { ApolloQueryResult } from 'apollo-client';
import graphqlService from '../graphql';
import { COMMON_GENERATE_UPLOAD_URL } from './queries';

export class CommonService implements CommonServiceTypes.ICommonService {
    /**
     * keep this in sync with server/tree/core/libs/storage.py
     * generate_s3_post_url function max_file_size parameter
     */
    MAX_UPLOAD_FILE_SIZE = 3145728;

    getImageFormat(fileName: string) {
        return fileName.match(/webp/i)
            ? 'webp'
            : fileName.match(/png/i)
            ? 'png'
            : fileName.match(/svg/i)
            ? 'svg+xml'
            : 'jpeg';
    }

    getMaxUploadFileSize() {
        return this.MAX_UPLOAD_FILE_SIZE;
    }

    /**
     * Get URL for posting image to S3
     */
    async getPostUrl(fileName: string, contentType?: string | undefined): Promise<UploadUrlData> {
        let variables: any = { filename: fileName };

        if (contentType) {
            variables.contentType = contentType;
        }

        const result = (await graphqlService.mutate({
            mutation: COMMON_GENERATE_UPLOAD_URL,
            variables,
        })) as ApolloQueryResult<{ commonGenerateUploadUrl: UploadUrlData }>;
        return result.data.commonGenerateUploadUrl;
    }

    async uploadImage(
        image: Blob | File | string,
        name: string = 'image',
        type: string = 'image/jpeg'
    ): Promise<string> {
        let fileName = 'file';

        if (image instanceof File) {
            fileName = image.name;
            type = image.type;
        }

        const formData = new FormData();
        const uploadData = await this.getPostUrl(fileName, type);

        Object.keys(uploadData.postParams).forEach(field => {
            formData.append(field, uploadData.postParams[field]);
        });

        if (typeof image === 'string') {
            // Upload file data
            // @ts-ignore
            formData.append('file', { uri: image, name, type });
        } else {
            // Upload file object
            formData.append('file', image, name);
        }

        try {
            const result: Response = await fetch(uploadData.uploadUrl, {
                method: 'POST',
                body: formData,
            });
            // Check we have OK status code.
            if (!result.ok) {
                console.warn('Upload failed.', result);

                // Resolve this as a promise instead of async/await so we can immediately
                // throw the error instead of waiting for the text to download.
                result.text().then(text => {
                    console.error('Error response from file upload: ', text);
                });

                throw new Error('Upload Failed');
            }
        } catch (e) {
            console.error('Failed to upload to S3', e);
            throw e;
        }

        return uploadData.destUrl;
    }
}

const commonService: CommonServiceTypes.ICommonService = new CommonService();
export default commonService;
