export const openURL = (url, target = '_self') => {
    window && window.open(url, target);
}
