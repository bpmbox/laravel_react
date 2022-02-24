/**
 * Mock Native moodules, so they can run in NodeJS env for unit tests.
 */
import { NativeModules } from 'react-native';

jest.mock('react-native-fs', () => {
    return {
        DocumentDirectoryPath: '/test',
    };
});

jest.mock('react-native-device-info', () => {
    return {
        isEmulatorSync: () => false,
    };
});

jest.mock('react-native-file-viewer', () => {
    return {
        open: jest.fn().mockResolvedValue(null),
    };
});

jest.mock('@react-native-community/async-storage', () => {
    let cache = {};
    return {
        setItem: (key, value) => {
            return new Promise((resolve, reject) => {
                return typeof key !== 'string' || typeof value !== 'string'
                    ? reject(new Error('key and value must be string'))
                    : resolve((cache[key] = value));
            });
        },
        getItem: (key, value) => {
            return new Promise(resolve => {
                return cache.hasOwnProperty(key) ? resolve(cache[key]) : resolve(null);
            });
        },
        removeItem: key => {
            return new Promise((resolve, reject) => {
                return cache.hasOwnProperty(key) ? resolve(delete cache[key]) : reject('No such key!');
            });
        },
        clear: key => {
            return new Promise((resolve, reject) => resolve((cache = {})));
        },
        getAllKeys: key => {
            return new Promise((resolve, reject) => resolve(Object.keys(cache)));
        },
    };
});

jest.mock('@invertase/react-native-apple-authentication', () => {
    return {
        AppleAuth: {
            getCredentialStateForUser: _args => {
                return Promise.resolve({});
            },
            performRequest: _args => {
                return Promise.resolve({});
            },
        },

        AppleAuthCredentialState: {
            APPROVED: '1',
            REVOKED: '2',
        },

        AppleAuthError: {
            CANCELED: '1001',
            INVALID_RESPONSE: '1002',
        },

        AppleAuthRequestScope: {
            EMAIL: '3',
            FULL_NAME: '4',
        },
    };
});

jest.mock('@react-native-community/google-signin', () => {
    return {
        GoogleSignin: {
            configure: () => Promise.resolve(),

            hasPlayServices: () => Promise.resolve(true),

            currentUserAsync: () => {
                return Promise.resolve({
                    name: 'name',
                    email: 'test@example.com',
                    // .... other user data
                });
            },
        },
    };
});

NativeModules.RNGoogleSignin = {
    BUTTON_SIZE_ICON: 0,
    BUTTON_SIZE_STANDARD: 0,
    BUTTON_SIZE_WIDE: 0,
    BUTTON_COLOR_AUTO: 0,
    BUTTON_COLOR_LIGHT: 0,
    BUTTON_COLOR_DARK: 0,
    SIGN_IN_CANCELLED: '0',
    IN_PROGRESS: '1',
    PLAY_SERVICES_NOT_AVAILABLE: '2',
    SIGN_IN_REQUIRED: '3',
    configure: jest.fn(),
    currentUserAsync: jest.fn(),
};

// Pulled from https://github.com/react-native-community/react-native-image-picker/blob/master/jest.setup.js
NativeModules.ImagePickerManager = {
    showImagePicker: jest.fn(),
    launchCamera: jest.fn(),
    launchImageLibrary: jest.fn(),
};

// Pulled from https://github.com/invertase/react-native-firebase/issues/1902#issuecomment-480886526
jest.mock('react-native-firebase', () => ({
    messaging: jest.fn(() => ({
        hasPermission: jest.fn(() => Promise.resolve(true)),
        subscribeToTopic: jest.fn(),
        unsubscribeFromTopic: jest.fn(),
        requestPermission: jest.fn(() => Promise.resolve(true)),
        getToken: jest.fn(() => Promise.resolve('myMockToken')),
    })),
    notifications: jest.fn(() => ({
        onNotification: jest.fn(),
        onNotificationDisplayed: jest.fn(),
    })),
    analytics: jest.fn(() => ({
        logEvent: jest.fn(),
    })),
}));

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

/**
 * Poly fill fetch() for unit tests.  Because react native does not have global fetch
 * when run in NodeJS.
 */
require('jest-fetch-mock').enableMocks();
