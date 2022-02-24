import { withNavigation } from '@react-navigation/core';
import get from 'lodash/get';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, View } from 'react-native';
import { getModalHeader, getRightActionHeader, ModalButtonType } from '../../../../components/Navigation/NavButtons';
import SectionHeading from '../../../../components/UIKit/items/SectionHeading';
import Select from '../../../../components/UIKit/items/Select';
import SingleLineInput from '../../../../components/UIKit/items/SingleLineInput';
import Spacer from '../../../../components/UIKit/items/Spacer';
import Switch from '../../../../components/UIKit/items/Switch';
import Text from '../../../../components/UIKit/items/Text';
import UserItem from '../../../../components/UIKit/items/UserItem';
import Page from '../../../../components/UIKit/Layout/Page';
import i18n from '../../../../i18n';
import { defaultStackNavigationOptions } from '../../../../libs/nav/config';
import useDebouncedState from '../../../../libs/use-debounced-state';
import { DesktopHeaderType, ItemHeight, ItemWidth } from '../../../../theme.style';
import ChatContext from './ChatContext';
import chatService from '../../../../services/chat';
import historyService from '../../../../services/history';
import messageService from '../../../../services/message';
import spaceService from '../../../../services/space';
import AuthStore from '../../../../store/auth';
import FullPageLoading from '../../../General/FullPageLoading';
import { SpaceContext } from '../../SpaceContext';
import { formatDisplayName } from '../../../../libs/user-utils';
import { PARAM_ON_DONE } from '../../../../constants';

const CreateChannelPage = props => {
    const { navigation } = props;
    const onDone = navigation.getParam(PARAM_ON_DONE); // (NSChat.Channel) => void

    const { t } = useTranslation('Chat::CreateChannelPage');
    const { currentUser, isAuthenticated } = AuthStore.useContainer();
    const { space } = useContext(SpaceContext);
    const [channelName, setChannelName] = useDebouncedState('', 200);
    const [description, setDescription] = useDebouncedState('', 200);
    const [isPrivate, setPrivate] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [spaceMembers, setSpaceMembers] = useState<SpaceServiceTypes.MembershipWithChat[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<SpaceServiceTypes.MembershipWithChat[]>([]);

    const { conversations, isChatContextReady } = useContext(ChatContext);

    const fetchMembers = useCallback(async () => {
        if (!space) {
            return;
        }

        let allMembers = await spaceService.getMembers(space);

        // exclude members with blank names
        allMembers = allMembers.filter(
            (member: SpaceServiceTypes.MembershipWithChat) => member.member.familyName || member.member.givenName
        );

        setSpaceMembers(allMembers);
    }, [space]);

    useEffect(() => {
        if (!isAuthenticated || !currentUser) {
            return;
        }

        if (spaceMembers.length === 0) {
            fetchMembers();
        }
    }, [currentUser, fetchMembers, isAuthenticated, spaceMembers]);

    const isFormDataValid = useCallback(() => {
        return isAuthenticated && currentUser && channelName.trim().length > 0;
    }, [channelName, currentUser, isAuthenticated]);

    const handleFormSubmit = useCallback(async () => {
        if (!isFormDataValid()) {
            return;
        }
        Keyboard.dismiss();
        setSubmitting(true);
        try {
            // check for duplicate channel name
            if (
                conversations.find(
                    (conv: NSChat.Conversation) =>
                        conv.isChannel && conv.name.toLowerCase() === channelName.trim().toLowerCase()
                )
            ) {
                messageService.sendError(t`Duplicate conversation name. Please choose a unique name.`);
                setSubmitting(false);
                return;
            }

            // TODO: pass correct members list (currently passes ALL)
            // const myMembership = await spaceService.getMemberById(space, currentUser.id);
            const myMembership = spaceMembers.filter(member => member.member.id === currentUser.id)[0];
            if (!myMembership) {
                return;
            }
            const myChatId = myMembership.chat.userId;
            // const memberChatIds = allMembers.map(member => member.chat.userId);
            const operatorChatIds = [myChatId];

            let channel = await chatService.createChannel(space, channelName, description, isPrivate, operatorChatIds);
            channel = chatService.setConversationPerspective(channel, spaceMembers, currentUser);

            // also add current user as a member
            await chatService.channelAddMember(channel, currentUser);

            messageService.sendSuccess(t`The channel has been created.`);

            // go back and then jump to the ConversationPage for this channel
            navigation.goBack();
            if (onDone && typeof onDone === 'function') {
                await onDone(channel);
            }
        } catch (err) {
            messageService.sendError(t`Unable to create channel.`);
            console.error('Error submitting data:', err);
        } finally {
            setSubmitting(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        channelName,
        conversations,
        currentUser,
        description,
        isAuthenticated,
        isChatContextReady,
        isFormDataValid,
        isPrivate,
        onDone,
        selectedMembers,
        space,
        spaceMembers,
        t,
    ]);

    // initialization code
    useEffect(() => {
        navigation.setParams({
            isFormDataValid: isFormDataValid(),
            handleFormSubmit: handleFormSubmit,
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleFormSubmit, isFormDataValid]);

    if (!isAuthenticated || !currentUser || !isChatContextReady) {
        return <FullPageLoading />;
    }

    return (
        <Page scrollable>
            <View>
                <SectionHeading text={t`Name`} />
                <SingleLineInput
                    text={channelName}
                    disabled={isSubmitting}
                    onChangeText={setChannelName}
                    placeholder={t`Enter channel name...`}
                    returnKeyType="next"
                    autoCorrect={false}
                    autoCapitalize="words"
                    autoFocus
                    desktopWidth={ItemWidth.narrow}
                />

                <SectionHeading text={t`Description`} />
                <SingleLineInput
                    text={description}
                    disabled={isSubmitting}
                    onChangeText={setDescription}
                    placeholder={t`Channel description (optional)`}
                    returnKeyType="next"
                    autoCorrect={false}
                    desktopWidth={ItemWidth.narrow}
                />

                <SectionHeading text={t`Visibility`} />
                <Switch
                    text={t`Private channel`}
                    toggled={isPrivate}
                    disabled={isSubmitting}
                    onPress={() => {
                        setPrivate(!isPrivate);
                    }}
                />
                <Text text={t`Private channels are accessible only by invitation.`} light small />

                {isPrivate && (
                    <>
                        <Spacer />
                        <SectionHeading text={t`Members`} />
                        <Select
                            title={t`Add members`}
                            actionTitle={t`Add members`}
                            values={spaceMembers.filter(
                                (member: SpaceServiceTypes.MembershipWithChat) =>
                                    currentUser && currentUser.id !== member.member.id
                            )}
                            currentSelection={selectedMembers}
                            disabled={!isPrivate}
                            disabledSelection={[]}
                            onSelectionChange={setSelectedMembers}
                            multi
                            allowDeselect
                            itemRenderer={(member, selected, disabled, itemProps) => (
                                <UserItem
                                    user={member.member}
                                    checked={selected}
                                    selected={selected}
                                    touchable={true}
                                    disabled={disabled}
                                    {...itemProps}
                                />
                            )}
                            titleRenderer={(member: SpaceServiceTypes.MembershipWithChat) =>
                                formatDisplayName(member.member)
                            }
                        />
                    </>
                )}

                <Spacer height={ItemHeight.xsmall} />
            </View>
        </Page>
    );
};

CreateChannelPage.navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);

    const title = get(navigation, 'state.params.title', i18n.t('CreateChannelPage::New Channel'));
    const isFormDataValid: boolean = get(navigation, 'state.params.isFormDataValid', false);
    const handleFormSubmit: () => void = get(navigation, 'state.params.handleFormSubmit', null);

    const finishSubmit = () => {
        handleFormSubmit && handleFormSubmit();
    };

    const rightHeader = getRightActionHeader(i18n.t('Create'), true, isFormDataValid, finishSubmit);

    return {
        ...defaultStackNavigationOptions,
        title: title,
        desktopHeaderType: DesktopHeaderType.plain,
        ...getModalHeader(ModalButtonType.cancel),
        ...rightHeader,
    };
};

export default withNavigation(CreateChannelPage);
