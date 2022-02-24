// Dependency inject the correct google Key to use.
// Note: this file will get overriden by google-client-id.web.ts,
// google-client-id.android.ts, google-client-id.ios.ts.
const getGoogleClientId = () => {
    return process.env.REACT_APP_GOOGLE_CLIENT_ID_WEB;
};

export default getGoogleClientId;
