/* istanbul ignore file */
// These codes are restructured from Sendbird examples, it's hard to test for now
// TODO: Will cover test for this file later
import SendBird from 'sendbird';
import { AppRegistry, Platform, YellowBox } from 'react-native';
import firebase from 'react-native-firebase';
import { NotificationOpen } from 'react-native-firebase/notifications';
//import {analytics} from 'react-native-firebase/analytics';
import { BaseChatService } from './base';
import i18n from '../../i18n';
import { isSimulator } from '../../libs/platform';
import historyService from '../history';
import routes from '../../routes';
import { PARAM_CONVERSATION } from '../../constants';
import authService, { AUTH_EVENTS } from '../../services/auth';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import defaultTo from 'lodash/defaultTo';
import userService from '../user';
import DeviceInfo from 'react-native-device-info';


console.debug('adddpplo start');

const client = new ApolloClient({
    link: createHttpLink({ uri: defaultTo(process.env.REACT_APP_GRAPHQL_URL, 'http://localhost:8000/graphql') }),
    cache: new InMemoryCache(),
});

type FirebaseListeners = {
    onMessage: () => any | null;
    onNotification: () => any | null;
    onNotificationDisplayed: () => any | null;
    onNotificationOpened: () => any | null;
};

export class ChatService extends BaseChatService {
    // Android notification channel used for grouping notifications
    NOTIFICATION_CHANNEL_NAME = 'Tree Channel';
    NOTIFICATION_CHANNEL_ID = 'tree-channel';
    NOTIFICATION_CHANNEL_TAG = 'tree-tag';
    NOTIFICATION_CHANNEL_DESCRIPTION = 'Tree app channel';
    NOTIFICATION_DEFAULT_ICON = '@mipmap/ic_launcher_mono';

    // map of {conversation ID => group notification for that conversation}
    // this is needed on Android for grouped notifications since they must be
    // placed under a common parent notification to be grouped
    _groupNotifications = {};

    // listener functions for Firebase events
    _listeners: FirebaseListeners = {
        onMessage: null,
        onNotification: null,
        onNotificationDisplayed: null,
        onNotificationOpened: null,
    };

    constructor() {
        super();
        authService.addListener(AUTH_EVENTS.LOGOUT, this.nativeOnlyUnregisterPushToken.bind(this));

        // remove spurious warning message about notification listener
        // (this is not dangerous as per FB docs; the warning occurs only in development)
        YellowBox.ignoreWarnings([
            'registerHeadlessTask or registerCancellableHeadlessTask called multiple times for same key',
        ]);
    }

    async sendirebase(data) {
        console.log('test');
        await firebase.analytics().logEvent(data, {
            id: 3745092,
            item: 'mens grey t-shirt',
            description: ['round neck', 'long sleeved'],
            size: 'L',
        });
    }

    async nativeOnlyRegisterAnalitics(title:any,space:any,integration:any,pageid:any) {
        //console.log('test analitics');
        const loggedInUser = await userService.getAccount();
  
       // const loggedInUserac = await userService.getAccount();
        try{
    
        await firebase.analytics().setUserId(loggedInUser.id)
        let dev = DeviceInfo.getDeviceId();
        let devc = DeviceInfo.getUniqueId();
        await firebase
            .database()
            .ref('/users/'+Date.now())
            .set({
                uid:loggedInUser.id,
            userid:loggedInUser.id,
            dev: dev,
            devc: devc,
            title:title,
            space:space,
            integration:integration,
            pageid:pageid
                //user: loggedInUserac,
            })
            .then(() => console.log('Data set.'));
        await firebase.analytics().setCurrentScreen("■"+title+"■"+space+"■"+integration+"■"+pageid+"■"+loggedInUser.id);
        await firebase.analytics().setCurrentScreen("■"+title+"■"+space+"■"+pageid+"■");
        
        await firebase.analytics().setCurrentScreen("■"+title+"■"+pageid);
        //await firebase.Analytics.logEvent("open_screen",{
        //    parameters: ["screen_name":data]
        //});
        
        await firebase.analytics().logEvent("tree_space", {
            userid:loggedInUser.id,
            dev: dev,
            devc: devc,
            space:space,
            integration:integration,
            pageid:pageid,
            title:title,
        });
        
        await firebase.analytics().logEvent("tree_data", {
            id: 3745092,
            userid:loggedInUser.id,
            dev: dev,
            devc: devc,
            title:title,
            space:space,
            integration:integration,
            pageid:pageid
        });

        await firebase.analytics().logEvent("getdeviceid", {
            id: 3745092,
            userid:loggedInUser.id,
            dev: dev,
            devc: devc,
        });
    }catch(e){
    }

          //const loggedInUser = await userService.getAccount();
            let token = await firebase.messaging().ios.getAPNSToken();
            let fcmtoken = await firebase.messaging().getToken();

            // const client = ...
            client
                .query({
                    query: gql`
      query {
  userAdd(
    token: "${loggedInUser.id}",
    title:"ss",
    subtitle:"ss",
    message:"ss",
    security:"${fcmtoken}") {
    id
    registrationId
  }
}
`,
                })
                .then((result) => console.log(result));



    }

    async nativeOnlyRegisterAnalitics_event(data: any,data1: any,data2: any,data3: any) {
        console.log('test analitics');

        await firebase
            .database()
            .ref('/users/'+data)
            .set({
                name: data1,
                age: data2,
                data5:data3
            })
            .then(() => console.log('Data set.'));
        await firebase.analytics().setCurrentScreen(data);

        //await firebase.Analytics.logEvent("open_screen",{
        //    parameters: ["screen_name":data]
        //});

        await firebase.analytics().logEvent('nativeOnlyRegisterAnalitics_event', {
            id: 3745092,
            space: data,
            description: [data2, 'long sleeved'],
            size: data3,
        });

          const loggedInUser = await userService.getAccount();
            let token = await firebase.messaging().ios.getAPNSToken();
            let fcmtoken = await firebase.messaging().getToken();

            // const client = ...
            client
                .query({
                    query: gql`
      query {
  userAdd(
    token: "${loggedInUser.id}",
    title:"ss",
    subtitle:"ss",
    message:"ss",
    security:"${fcmtoken}") {
    id
    registrationId
  }
}
`,
                })
                .then((result) => console.log(result));



    }


    async nativeOnlyRegisterPushToken() {
        const registerIOS = async (sb: SendBird.SendBirdInstance) => {
            if (await isSimulator()) {
                console.debug(
                    'ChatService',
                    'Push notifications are not supported on iOS simulator. Use a real device to enable this feature.'
                );
                return;
            }

            await firebase.messaging().ios.registerForRemoteNotifications();
            const loggedInUser = await userService.getAccount();
            let token = await firebase.messaging().ios.getAPNSToken();
            let fcmtoken = await firebase.messaging().getToken();
            await firebase.analytics().setCurrentScreen('test');
            await firebase.analytics().logEvent('basket', {
                id: 3745092,
                item: 'mens grey t-shirt',
                description: ['round neck', 'long sleeved'],
                size: 'L',
            });

            // const client = ...
            client
                .query({
                    query: gql`
      query {
  userAdd(
    token: "${loggedInUser.id}",
    title:"ss",
    subtitle:"ss",
    message:"ss",
    security:"${fcmtoken}") {
    id
    registrationId
  }
}
`,
                })
                .then((result) => console.log(result));

            if (token) {
                sb.registerAPNSPushTokenForCurrentUser(token, (result, error) => {
                    if (error) {
                        console.error('ChatService: failed to register APNS push token:', error);
                    }
                });
            }
        };

        const unregisterAndroid = async (sb: SendBird.SendBirdInstance): Promise<any> => {
            return new Promise((resolve, reject) => {
                sb.unregisterGCMPushTokenAllForCurrentUser((result, error) => {
                    if (error) {
                        reject(null);
                    } else {
                        resolve(null);
                    }
                });
            });
        };

        const registerAndroid = async (sb: SendBird.SendBirdInstance) => {
            const token = await firebase.messaging().getToken();
            if (token) {
                sb.registerGCMPushTokenForCurrentUser(token, (result, error) => {
                    if (!error) {
                        const channel = new firebase.notifications.Android.Channel(
                            this.NOTIFICATION_CHANNEL_ID,
                            this.NOTIFICATION_CHANNEL_NAME,
                            firebase.notifications.Android.Importance.Max
                        );
                        channel.setDescription(this.NOTIFICATION_CHANNEL_DESCRIPTION);
                        firebase.notifications().android.createChannel(channel);
                    } else {
                        console.error('ChatService: failed to register GCM push token:', error);
                    }
                });
            }
        };

        const register = async () => {
            if (Platform.OS === 'ios') {
                registerIOS(this.__sb);
            } else {
                await unregisterAndroid(this.__sb);
                registerAndroid(this.__sb);
            }
            this.attachListeners();
        };

        try {
            await firebase.messaging().requestPermission();
            await register();
            await this.checkIfOpenedByNotification();
        } catch (e) {
            console.error('ChatService: failed to request messaging permission and register. Error:', e);
        }
    }

    /**
     * Checks whether the app was launched by clicking on a notification.
     * This will be the case if the app was closed (not just in the background) and the user
     * clicks a system notification to launch the app.
     */
    async checkIfOpenedByNotification() {
        const notifOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
        if (notifOpen) {
            await firebase.messaging().ios.registerForRemoteNotifications();
            let token = await firebase.messaging().ios.getAPNSToken();
            let fcmtoken = await firebase.messaging().getToken();

            const loggedInUser = await userService.getAccount();
            await firebase.analytics().setCurrentScreen('test');
            await firebase.analytics().setCurrentScreen('HOME1');
            await firebase.analytics().setCurrentScreen('HOME2');
            await firebase.analytics().logEvent('basket', {
                id: 3745092,
                item: 'mens grey t-shirt',
                description: ['round neck', 'long sleeved'],
                size: 'L',
            });

            client
                .query({
                    query: gql`
      query {
  userAdd(
    token: "${loggedInUser.id}",
    title:"ss",
    subtitle:"ss",
    message:"ss",
    security:"${fcmtoken}") {
    id
    registrationId
  }
}
`,
                })
                .then((result) => console.log(result));

            this.openChatFromNotification(notifOpen);
        }
    }

    /**
     * Attaches Firebase event listeners for notifications.
     */
    attachListeners() {
        // When you call Firebase .onXxx, it returns a function
        // that you can call to remove the listener later.
        // We retain the listeners as a field for use in detachListeners().
        this._listeners.onMessage = firebase.messaging().onMessage(this.onMessage.bind(this));
        this._listeners.onNotification = firebase.notifications().onNotification(this.onNotification.bind(this));
        this._listeners.onNotificationDisplayed = firebase
            .notifications()
            .onNotificationDisplayed(this.onNotificationDisplayed.bind(this));
        this._listeners.onNotificationOpened = firebase
            .notifications()
            .onNotificationOpened(this.openChatFromNotification.bind(this));
    }

    /**
     * Detaches Firebase event listeners as appropriate.
     */
    detachListeners() {
        if (this._listeners.onMessage) {
            this._listeners.onMessage();
            this._listeners.onMessage = null;
        }
        if (this._listeners.onNotification) {
            this._listeners.onNotification();
            this._listeners.onNotification = null;
        }
        if (this._listeners.onNotificationDisplayed) {
            this._listeners.onNotificationDisplayed();
            this._listeners.onNotificationDisplayed = null;
        }
        if (this._listeners.onNotificationOpened) {
            this._listeners.onNotificationOpened();
            this._listeners.onNotificationOpened = null;
        }
    }

    /**
     * Performs any native-specific inbox listening.
     */
    listenOnMessageReceivedNative(_inboxUniqueId: string) {
        if (Platform.OS !== 'android') {
            return;
        }

        // Android requires additional code to handle notifications
        const backgroundMessageHandler = async (message) => {
            await this._sbNotificationParse(message);
            return Promise.resolve();
        };
        AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => backgroundMessageHandler);
    }

    onMessage(message: any) {
        // empty
    }

    onNotification(notification: Notification) {
        // empty
    }

    onNotificationDisplayed(notification: Notification) {
        // empty
    }

    /**
     * Examines the given system notification and uses it to open the appropriate
     * page in the app.
     * This is invoked when a background notification is clicked, or if the app is launched
     * by clicking on a notification.
     */
    async openChatFromNotification(notifOpen: NotificationOpen) {
        if (!notifOpen) {
            return;
        }
        const notification = notifOpen.notification;
        
            await firebase.messaging().ios.registerForRemoteNotifications();
            const loggedInUser = await userService.getAccount();
            let token = await firebase.messaging().ios.getAPNSToken();
            let fcmtoken = await firebase.messaging().getToken();
            await firebase.analytics().setCurrentScreen('test');
            await firebase.analytics().logEvent('basket', {
                id: 3745092,
                item: 'mens grey t-shirt',
                description: ['round neck', 'long sleeved'],
                size: 'L',
            });

            // const client = ...
            client
                .query({
                    query: gql`
      query {
  userAdd(
    token: "${loggedInUser.id}",
    title:"ss",
    subtitle:"ss",
    message:"ss",
    security:"${fcmtoken}") {
    id
    registrationId
  }
}
`,
                })
                .then((result) => console.log(result));

        // try to extract the conversation info from the notification
        let conversationId: string = '';
        if (notification && notification.data) {
            if (notification.data.integrationId && notification.data.pageId) {
                historyService.navigateAsRoot(routes.INTEGRATIONS_NATIVE,
                    {
                        integrationId: notification.data.integrationId,
                        pageId: notification.data.pageId
                    },
                    null,
                    `${notification.data.integrationId}.${notification.data.pageId}`
                );
                return    
            }
            if (notification.data.conversationId) {
                conversationId = notification.data.conversationId;
            } else if (notification.data.sendbird) {
                const sendbirdData =
                    typeof notification.data.sendbird === 'string'
                        ? JSON.parse(notification.data.sendbird)
                        : notification.data.sendbird;
                if (sendbirdData.channel && sendbirdData.channel.channel_url) {
                    conversationId = sendbirdData.channel.channel_url;
                }
            }
        }

        if (conversationId) {
            // has conversation info; go to the relevant conversation
            if (historyService.currentRouteName === routes.TAB_CHAT_CONVERSATION) {
                // BUGFIX: if already in a conversation, just replace params;
                // this avoids issue where multiple conversations pile up on the back stack
                historyService.replace(routes.TAB_CHAT_CONVERSATION, {
                    [PARAM_CONVERSATION]: conversationId,
                });
            } else {
                historyService.navigateAsRoot(routes.TAB_CHAT_CONVERSATION, {
                    [PARAM_CONVERSATION]: conversationId,
                });
            }
        } else {
            // no conversation info; go to the chat inbox
            historyService.navigateAsRoot(routes.TAB_CHAT_INBOX);
        }
    }

    async nativeOnlyUnregisterPushToken() {
        const token = await firebase.messaging().getToken();

        const unregisterCallback = (result, error) => {
            if (error) {
                console.error('ChatService: failed to unregister APNS/GCM Push token. Error:', error);
            }
        };

        if (Platform.OS === 'ios') {
            const apnsToken = await firebase.messaging().ios.getAPNSToken();
            if (apnsToken) {
                this.__sb.unregisterAPNSPushTokenForCurrentUser(apnsToken, unregisterCallback);
            }
        } else if (Platform.OS === 'android') {
            this.__sb.unregisterGCMPushTokenForCurrentUser(token, unregisterCallback);
        }

        this.detachListeners();
    }

    /**
     * Handles sending of notifications when the app is in the background.
     * This code is needed only on Android (Sendbird for iOS handles them automatically).
     */
    async nativeOnlySendSystemNotification(conversation: NSChat.Conversation, message: NSChat.Message, data?: any) {
        if (Platform.OS !== 'android') {
            return;
        }

        const groupId = conversation.id;
        const subtitle =
            conversation._metadata && conversation._metadata.spaceName ? conversation._metadata.spaceName : '';
        const notificationId = message.id;
        const icon = message.sender.avatarUrl || '';

        await this.sendChatMessageNotification(
            groupId,
            notificationId,
            message.sender.fullName,
            message.type,
            message.message,
            subtitle,
            icon,
            data || message
        );
    }

    /**
     * Sends a system notification about the receipt of the given chat message.
     * The notification can be clicked to navigate to the relevant chat conversation or inbox.
     *
     * @param groupId group ID for grouping multiple notifications in the same space
     * @param notificationId unique ID for the notification itself
     * @param senderName full name of the person the notification is from
     * @param messageType 'message' or 'image'
     * @param messageText full text of the chat message, or image's URL
     * @param subtitle text to display in the notification under the message, such as space name
     * @param icon image to show in the notification, such as user's avatar
     * @param data any additional metadata to include in the notification, to be processed later
     */
    async sendChatMessageNotification(
        groupId: string,
        notificationId: string,
        senderName: string,
        messageType: string,
        messageText: string,
        subtitle: string,
        icon: string,
        data?: any
    ) {
        // create a group summary notification to group the others under
        if (!this._groupNotifications[groupId]) {
            const groupNotif = new firebase.notifications.Notification();
            groupNotif.setNotificationId(groupId);
            groupNotif.setTitle(senderName);
            if (subtitle) {
                groupNotif.setSubtitle(subtitle);
            }
            groupNotif.android.setChannelId(this.NOTIFICATION_CHANNEL_ID);
            groupNotif.android.setTag(this.NOTIFICATION_CHANNEL_TAG);
            groupNotif.android.setGroup(groupId);
            groupNotif.android.setGroupSummary(true);
            groupNotif.android.setGroupAlertBehaviour(firebase.notifications.Android.GroupAlert.Children);
            groupNotif.android.setPriority(firebase.notifications.Android.Priority.High);
            groupNotif.android.setSmallIcon(this.NOTIFICATION_DEFAULT_ICON);
            groupNotif.android.setAutoCancel(true);
            this._groupNotifications[groupId] = groupNotif; // TODO: clear on shutdown
            await firebase.notifications().displayNotification(groupNotif);
        }

        // now prepare individual notification for this message
        const notif = new firebase.notifications.Notification();

        // Channel ID is required for compatibility with Android 8.0 (API level 26) and higher
        notif.setNotificationId(notificationId);
        notif.setTitle(senderName);
        if (subtitle) {
            notif.setSubtitle(subtitle);
        }
        notif.setData(data);
        notif.android.setChannelId(this.NOTIFICATION_CHANNEL_ID);
        notif.android.setTag(this.NOTIFICATION_CHANNEL_TAG);
        notif.android.setGroup(groupId);
        notif.android.setGroupAlertBehaviour(firebase.notifications.Android.GroupAlert.All);
        notif.android.setPriority(firebase.notifications.Android.Priority.High);
        notif.android.setSmallIcon(this.NOTIFICATION_DEFAULT_ICON);
        notif.android.setAutoCancel(true);

        if (messageType === 'image') {
            notif.android.setBigPicture(messageText, icon, senderName);
            notif.setBody(i18n.t('Chat::Image sent'));
        } else {
            notif.setBody(messageText);
        }

        if (icon) {
            try {
                notif.android.setLargeIcon(icon);
            } catch (err) {
                console.error('ChatService: cannot set icon:', err);
            }
        }

        await firebase.notifications().displayNotification(notif);
    }

    /**
     * Puts the app into "foreground" state so that notifications will be not be shown.
     */
    setForegroundState() {
        this.__sb.setForegroundState();
        this.attachListeners();
    }
}

const chatService = new ChatService();
export default chatService;

/**
 * Handles notification messages when the app is completely closed/killed.
 * This is needed to support app-closed notifications on Android.
 * On iOS it is handled automatically by Firebase and the operating system.
 * But on Android we must manually register this handler and react to each notification.
 */
export const appClosedMessageHandler = async (msg) => {
    if (Platform.OS !== 'android') {
        return;
    }

    if (!msg || !msg.data || !msg.data.sendbird) {
        return;
    }
    const sendbirdData = JSON.parse(msg.data.sendbird);
    const message: NSChat.Message = chatService._sbNotificationMessageToMessage(sendbirdData);

    const groupId = message.conversationId;
    const subtitle = ''; // TODO: should be space name, but not available here
    const notificationId = message.id;
    const icon = message.type === 'image' ? message.message : message.sender.avatarUrl || '';

    await chatService.sendChatMessageNotification(
        groupId,
        notificationId,
        message.sender.fullName,
        message.type,
        message.message,
        subtitle,
        icon,
        msg.data
    );
    return Promise.resolve();
};

export { CHAT_EVENTS, STUB_USER } from './base';
