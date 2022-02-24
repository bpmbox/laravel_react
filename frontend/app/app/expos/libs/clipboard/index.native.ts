import { Clipboard } from 'react-native';

export const copyToClipboard = (text) => {
    return Clipboard.setString(text);
};
