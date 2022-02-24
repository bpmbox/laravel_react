import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import commonService from '../../services/common';

/**
 * Returns true if resizing the given image is supported.
 * We support resizing JPEG and PNG images.
 */
const resizeImageSupported = (filename?: string) => {
    return !!(!filename || filename.match(/(png|jpeg|jpg)$/i));
};

// preserves aspect ratio
const resizeImage = async (
    image: string | File,
    width: number,
    height: number
): Promise<CommonServiceTypes.IResizedImage | null> => {
    // react-native-image-resizer strictly supports only JPEG, PNG, WEBP
    let imageUri: string;
    if (typeof image === 'string') {
        imageUri = (image as string) || '';
    } else {
        const imageFile = image as File;
        imageUri = imageFile.name || '';
    }
    try {
        const response = await ImageResizer.createResizedImage(
            imageUri,
            width,
            height,
            // @ts-ignore
            commonService.getImageFormat(imageUri).toUpperCase(), // react-native-image-resizer requires uppercase image file types
            90
        );
        // response = {
        //     "height": 768,
        //     "name": "1582581457996.JPEG",
        //     "path": "/data/user/0/com.withtree.app/cache/1582581457996.JPEG",
        //     "size": 201942,
        //     "uri": "file:///data/user/0/com.withtree.app/cache/1582581457996.JPEG",
        //     "width": 1024
        // }

        // fix possible filename casing issue (RNIR likes to use uppercase JPEG, etc.)
        const newPath = response.path.replace(/\.jpeg$/i, '.jpg');
        const newUri = response.uri.replace(/\.jpeg$/i, '.jpg');
        if (response.path !== newPath) {
            await RNFS.moveFile(response.path, newPath);
            response.path = newPath;
            response.uri = newUri;
        }
        // fill in properties that may be missing
        return {
            height: response.height,
            name: response.name || '',
            path: response.path,
            size: response.size || 0,
            uri: response.uri,
            width: response.width,
        };
    } catch (err) {
        console.warn('Failed to resize image:', err);
        return null;
    }
};

export { resizeImage, resizeImageSupported };
