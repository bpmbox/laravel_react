// Plugin used by web-client/src/i18n.ts
declare module 'i18next-intervalplural-postprocessor';
declare module 'i18next-react-native-language-detector';
declare module '@react-navigation/core';

// Used by authContainer to check token expiration
declare module 'jwt-decode' {
    function decode(token: string): any;
    namespace decode {}
    export = decode;
}
