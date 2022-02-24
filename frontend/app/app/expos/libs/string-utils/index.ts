import {capitalize as lodashCapitalize} from 'lodash';

export const countLines = (text?: string) => {
    return text ? text.split(/\r\n|\r|\n/).length : 0;
};

export const capitalize = (text: string): string => {
    if (typeof text !== 'string') {
        return null;
    }
    if (text.length === 0) {
        return text;
    }
    return lodashCapitalize(text);
}

export const uncapitalize = (text: string): string => {
    if (typeof text !== 'string') {
        return null;
    }
    if (text.length === 0) {
        return text;
    }
    return text.charAt(0).toLowerCase() + text.slice(1);
}
