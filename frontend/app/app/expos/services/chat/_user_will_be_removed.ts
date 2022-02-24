/* istanbul ignore file */
// Temporary keep this file for a reference to some usages of sendbird
import SendBird from 'sendbird';
import { Platform } from 'react-native';
import firebase from 'react-native-firebase';

export const sbRegisterPushToken = () => {
    const registerIOS = (sb: SendBird.SendBirdInstance) => {
        firebase
            .messaging()
            .ios.registerForRemoteNotifications()
            .then(() => {
                firebase
                    .messaging()
                    .ios.getAPNSToken()
                    .then(token => {
                        console.log('Got APNS Token : ' + token);
                        if (token) {
                            sb.registerAPNSPushTokenForCurrentUser(token, (result, error) => {
                                if (!error) {
                                    console.log('Did succeed to register APNS Token');
                                } else {
                                    console.error('Did fail register APNS Push token ' + error);
                                }
                            });
                        }
                    });
            });
    };

    const registerAndroid = (sb: SendBird.SendBirdInstance) => {
        firebase
            .messaging()
            .getToken()
            .then(token => {
                if (token) {
                    sb.registerGCMPushTokenForCurrentUser(token, (result, error) => {
                        if (!error) {
                            console.log('Did succeed to register GCM Token');
                        } else {
                            console.error('Did fail register GCM Push token ' + error);
                        }
                    });
                }
            });
    };

    const register = () => {
        const sb = SendBird.getInstance();
        if (sb) {
            if (Platform.OS === 'ios') {
                registerIOS(sb);
            } else if (Platform.OS === 'android') {
                registerAndroid(sb);
            }
        } else {
            console.error('SendBird is not initialized');
        }
    };

    firebase
        .messaging()
        .requestPermission()
        .then(() => {
            register();
        })
        .catch(error => {
            console.debug('Permission not granted : ' + error);
        });
};

export const sbUnregisterPushToken = () => {
    return new Promise((resolve, reject) => {
        firebase
            .messaging()
            .getToken()
            .then(token => {
                const sb = SendBird.getInstance();
                if (sb) {
                    if (Platform.OS === 'ios') {
                        firebase
                            .messaging()
                            .ios.getAPNSToken()
                            .then(apnsToken => {
                                if (!apnsToken) {
                                    return resolve();
                                }
                                sb.unregisterAPNSPushTokenForCurrentUser(apnsToken, (result, error) => {
                                    if (!error) {
                                        resolve();
                                    } else {
                                        reject(error);
                                    }
                                });
                            })
                            .catch(err => reject(err));
                    } else {
                        sb.unregisterGCMPushTokenForCurrentUser(token, (result, error) => {
                            if (!error) {
                                resolve();
                            } else {
                                reject(error);
                            }
                        });
                    }
                } else {
                    reject('SendBird is not initialized');
                }
            })
            .catch(err => reject(err));
    });
};

export const sbConnect = (userId: string, accessToken: string) => {
    return new Promise((resolve, reject) => {
        if (!userId) {
            console.error('UserID is required.');
            reject('UserID is required.');
            return;
        }

        const sb = new SendBird({ appId: process.env.REACT_APP_SENDBIRD_APP_ID });
        console.log('Connecting to sendbird....');
        sb.connect(userId, accessToken, (user, error) => {
            if (error) {
                console.error('SendBird Login Failed.', error);
                reject('SendBird Login Failed.');
            } else {
                console.log('SendBird Login successfully.');
            }
        });
    });
};

export const sbDisconnect = () => {
    return new Promise((resolve, _reject) => {
        const sb = SendBird.getInstance();
        if (sb) {
            sb.disconnect(() => {
                resolve(null);
            });
        } else {
            resolve(null);
        }
    });
};
