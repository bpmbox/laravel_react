/**
 * Defined universal link routes.
 */
const univeralLinks = {
    CHANGE_EMAIL_CODE: '/email-change/verify',
    LOGIN: '/login',
    LOGIN_VALIDATE: '/login/validate',
    JOIN: '/join/:slug',
    IMPERSONATE: '/~impersonate',
    INTEGRATION_INDEX_PAGE: '/:slug/workspace/:integrationId',
    INTEGRATION_PAGE: '/:slug/workspace/:integrationId/:pageId'
};

export default univeralLinks;
