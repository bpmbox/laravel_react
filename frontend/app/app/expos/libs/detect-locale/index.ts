/**
 * Attempt to detect system locale of Mobile device.
 */
/* istanbul ignore file */
// This cannot be unit tested effectively.  Basically a unit test will be mocking out the entire device settings and testing against that assumption.
// Provides not additional value.
import { InitOptions, LanguageDetectorModule } from 'i18next';
import get from 'lodash/get';
import { NativeModules } from 'react-native';
import i18n from '../../i18n';
import languages from '../../locales';

const languageDetector: LanguageDetectorModule = {
    type: 'languageDetector',
    init: function (_services: i18n.Services, _detectorOptions: object, _i18nextOptions: InitOptions) {
        // We'll just use only system langauge for now.
    },
    detect: () => {
        return __detectLanguage();
    },
    cacheUserLanguage: function (_lng: string) {
        // For now we don't support caching language options.
    }
};
export default languageDetector;


function __detectLanguage() {
    let detectedLocaleString = __getSystemLocaleString();
    
    const { languageCode, countryCode } = __parseSystemLocaleString(detectedLocaleString);


    // Attempt to find the best matching locale.
    return __getBestLocaleMatch(languageCode, countryCode);
}

function __parseSystemLocaleString(detectedLocaleString: any) {
    // Some OS uses '_' underscore instead of dash or have different formats.  So we need to format in a way i18n expects.
    // Get locale code as lower case letters.
    
    const languageCodeMatch = /([a-z]+)/.exec(detectedLocaleString);
    // Get country code using UPPERCASE letters.
    const countryCodeMatch = /([A-Z]+)/.exec(detectedLocaleString);
    if (!countryCodeMatch) {
        // Perhaps the country code is in lower case.  So we'll search for the 2nd set of lower case letters.
        /(?:[a-z]+[^a-z])([a-z]+)/.exec(detectedLocaleString);
    }
    const languageCode = languageCodeMatch && languageCodeMatch.length > 1 ? languageCodeMatch[1] : 'en';
    const countryCode = countryCodeMatch && countryCodeMatch.length > 1 ? countryCodeMatch[1] : 'US';
    return { languageCode, countryCode };
}

function __getBestLocaleMatch(languageCode: string, countryCode: string) {
    let matchingLocalCodes = Object.keys(languages);

    // Start with en-US as the default.
    let detectedLocale = 'ja-JP';

    matchingLocalCodes = matchingLocalCodes.filter(x => x.includes(languageCode));
    if (matchingLocalCodes) {
        detectedLocale = matchingLocalCodes[0];
    }

    matchingLocalCodes = matchingLocalCodes.filter(x => x.includes(countryCode));
    if (matchingLocalCodes) {
        detectedLocale = matchingLocalCodes[0];
    }

    return detectedLocale;
}

function __getSystemLocaleString() {
    let detectedLocaleString = get(NativeModules, 'SettingsManager.settings.localeIdentifier', ''); // Android and Most phones
    if (!detectedLocaleString) {
        detectedLocaleString = get(NativeModules, 'SettingsManager.settings.AppleLanguages[0]'); // newer iOS
    }
    if (!detectedLocaleString) {
        detectedLocaleString = get(NativeModules, 'SettingsManager.settings.AppleLocale'); // older iOS
    }
    if (!detectedLocaleString) {
        detectedLocaleString = 'en-US'; // Final fallback to english.
    }

    return detectedLocaleString;
}

