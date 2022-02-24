export const copyToClipboard = (text) => {
    const textField = document.createElement('textarea');
    textField.innerHTML = text;
    textField.style.position = 'absolute';
    textField.style.top = '-1000px';
    textField.style.left = '-1000px';
    document.body.appendChild(textField);
    textField.select();
    try {
        document.execCommand('copy');
    } catch (e) {}
    document.body.removeChild(textField);
};
