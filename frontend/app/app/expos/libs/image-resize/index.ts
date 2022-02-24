// adapted from code taken from:
// https://github.com/onurzorluer/react-image-file-resizer/

import commonService from '../../services/common';

const changeHeightWidth = (height: number, maxHeight: number, width: number, maxWidth: number) => {
    if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
    }
    if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
    }
    return { height, width };
};

const resizeAndRotateImage = (
    image: CanvasImageSource,
    maxWidth: number,
    maxHeight: number,
    compressFormat = 'jpeg',
    quality: number = 100,
    rotation: number = 0
): any => {
    const qualityDecimal = quality / 100;
    const canvas = document.createElement('canvas');
    let width = Number(image.width);
    let height = Number(image.height);
    const newHeightWidth = changeHeightWidth(height, maxHeight, width, maxWidth);
    if (rotation && (rotation === 90 || rotation === 270)) {
        canvas.width = newHeightWidth.height;
        canvas.height = newHeightWidth.width;
    } else {
        canvas.width = newHeightWidth.width;
        canvas.height = newHeightWidth.height;
    }

    width = newHeightWidth.width;
    height = newHeightWidth.height;

    const ctx = canvas.getContext('2d');

    if (rotation) {
        ctx.rotate((rotation * Math.PI) / 180);
        if (rotation === 90) {
            ctx.translate(0, -canvas.width);
        } else if (rotation === 180) {
            ctx.translate(-canvas.width, -canvas.height);
        } else if (rotation === 270) {
            ctx.translate(-canvas.height, 0);
        } else if (rotation === 0 || rotation === 360) {
            ctx.translate(0, 0);
        }
    }
    ctx.drawImage(image, 0, 0, width, height);

    return {
        dataUri: canvas.toDataURL(`image/${compressFormat}`, qualityDecimal),
        height: height,
        width: width,
    };
};

const b64toBlob = (b64Data, contentType) => {
    contentType = contentType || 'image/jpeg';
    let sliceSize = 512;

    let byteCharacters = window.atob(b64Data.toString().replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
};

const createResizedImage = async (
    file: File,
    maxWidth: number,
    maxHeight: number,
    compressFormat: string,
    quality: number,
    rotation: number,
    format: 'base64' | 'blob'
): Promise<any> => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            const dataUrl: string = reader.result as string;
            const image = new Image();
            image.src = dataUrl;
            image.onload = () => {
                let resizeResult = resizeAndRotateImage(image, maxWidth, maxHeight, compressFormat, quality, rotation);
                if (format === 'blob') {
                    const blob = b64toBlob(resizeResult.dataUri, `image/${compressFormat}`);
                    resizeResult.data = blob;
                }
                resolve(resizeResult);
            };
        };
        reader.onerror = err => {
            reject(err);
        };
    });
};

/**
 * Returns true if resizing the given image is supported.
 * We support resizing JPEG and PNG images.
 */
const resizeImageSupported = (filename?: string) => {
    return !!(!filename || filename.match(/(png|jpeg|jpg)$/i));
};

const resizeImage = async (
    image: string | File,
    width: number,
    height: number
): Promise<CommonServiceTypes.IResizedImage | null> => {
    if (image instanceof String) {
        throw new Error('Argument must be a File');
    } else {
        const imageFile = image as File;
        const result = await createResizedImage(
            imageFile,
            width,
            height,
            commonService.getImageFormat(imageFile.name),
            90,
            0,
            'blob'
        );
        return {
            data: result.data,
            height: result.height,
            name: imageFile.name,
            path: '',
            size: result.data.length,
            uri: result.dataUri,
            width: result.width,
        };
    }
};

export { resizeImage, resizeImageSupported };
