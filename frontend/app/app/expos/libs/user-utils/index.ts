import i18n from '../../i18n';

/**
 * Format full name display according to locale.
 */
export const formatDisplayNameBare = (givenName: string, familyName: string): string => {
    return i18n.t('UserUtils::{{givenName}} {{familyName}}', {
        givenName: givenName,
        familyName: familyName,
    });
};

/**
 * Format full name display according to locale.
 */
export const formatDisplayName = (user: User): string => {
    return formatDisplayNameBare(user.givenName, user.familyName);
};
