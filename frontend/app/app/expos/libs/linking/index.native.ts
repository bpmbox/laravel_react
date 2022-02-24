import { Linking } from 'react-native';

export const openURL = (url, _) => {
    Linking.openURL(url)
}
