/* istanbul ignore file */
// Temporary keep this file for a reference to some usages of sendbird
import SendBird from 'sendbird';

export const sbGetGroupChannel = channelUrl => {
    return new Promise((resolve, reject) => {
        const sb = SendBird.getInstance();
        sb.GroupChannel.getChannel(channelUrl, (channel, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(channel);
            }
        });
    });
};

export const sbLeaveGroupChannel = channelUrl => {
    return new Promise((resolve, reject) => {
        SendBird.getInstance();
        sbGetGroupChannel(channelUrl)
            .then(channel => {
                channel.leave((response, error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
            })
            .catch(error => reject(error));
    });
};

export const sbCreateGroupChannel = (inviteUserIdList, isDistinct) => {
    return new Promise((resolve, reject) => {
        const sb = SendBird.getInstance();
        sb.GroupChannel.createChannelWithUserIds(inviteUserIdList, isDistinct, (channel, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(channel);
            }
        });
    });
};

export const sbInviteGroupChannel = (inviteUserIdList, channelUrl) => {
    return new Promise((resolve, reject) => {
        sbGetGroupChannel(channelUrl)
            .then(groupChannel => {
                groupChannel.inviteWithUserIds(inviteUserIdList, (channel, error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(channel);
                    }
                });
            })
            .catch(error => {
                reject(error);
            });
    });
};
