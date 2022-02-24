import { withNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getModalHeader, ModalButtonType } from '../../../components/Navigation/NavButtons';
import Button from '../../../components/UIKit/items/Button';
import SectionHeading from '../../../components/UIKit/items/SectionHeading';
import Spacer from '../../../components/UIKit/items/Spacer';
import SpaceSelectorItem from '../../../components/UIKit/items/SpaceSelectorItem';
import Text from '../../../components/UIKit/items/Text';
import Page from '../../../components/UIKit/Layout/Page';
import i18n from '../../../i18n';
import { defaultStackNavigationOptions } from '../../../libs/nav/config';
import { PARAM_SPACE } from '../../../constants';
import routes from '../../../routes';
import { DesktopHeaderType, ItemHeight, PaddingType } from '../../../theme.style';
import historyService from '../../../services/history';
import messageService from '../../../services/message';
import spaceService from '../../../services/space';
import AuthStore from '../../../store/auth';
import { isMobilePlatform } from '../../../libs/platform';

const AddSpacePage = () => {
    const { t } = useTranslation('AddSpacePage');
    const { currentUser } = AuthStore.useContainer();
    const [invitedSpaces, setInvitedSpaces] = useState<Space[]>([]);
    const [isJoining, setIsJoining] = useState<boolean>(false);
    const joiningSpaceRef = useRef<Space>();

    const count = (invitedSpaces && invitedSpaces.length) || 0;

    useEffect((): void => {
        (async function fetchSpaces(): Promise<void> {
            try {
                const spaces = await spaceService.getInvitedSpaces();
                setInvitedSpaces(spaces);
            } catch (e) {
                messageService.sendError(e.message, t`Error`);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getDataandJoin = async (space: Space) => {
        if(isMobilePlatform){
            //モバイルアプリの場合はチュートリアル画面へ遷移
            historyService.navigateAsRoot(routes.ONBOARDING_SPACE_INTRO, {[PARAM_SPACE]: space});
        }else{
            joinSpace(space);
        }
    }

    const joinSpace = async (space: Space) => {
        joiningSpaceRef.current = space;
        setIsJoining(true);
        try {
            await spaceService.joinSpace(space);
            setIsJoining(false);
            historyService.navigateAsRoot(routes.MAIN_SPACE_REDIRECT, {
                [PARAM_SPACE]: space,
            });
        } catch (e) {
            console.error('Error occurred while trying to join space', e);
            messageService.sendError(
                t('Error occurred while trying to join {{spaceName}}.', {
                    spaceName: space.name,
                })
            );
            setIsJoining(false);
        }
    };

    const handleCreateSpace = (): void => {
        historyService.push(routes.JOIN_SPACE_CREATE);
    };

    const message =
        count > 0
            ? t`A space is where your community comes to life. You can create spaces or join spaces that you have been invited to.`
            : t`A space is where your community comes to life. Create a space now and invite people to join it.`;

    return <Page scrollable desktopPadding={PaddingType.horizontalBottom}>
        <Text text={message} light small />
        <Spacer height={ItemHeight.xsmall} />
        <Button onPress={handleCreateSpace} text={t`Create a Space`} />

            {count > 0 && (
                <>
                    <SectionHeading text={t`Spaces you've been invited to`} />
                    {invitedSpaces.map((space: Space) => {
                        const isJoiningThisSpace =
                            isJoining && joiningSpaceRef.current.id === space.id;
                        return (
                            <SpaceSelectorItem
                                testID={`SelectSpace_${space.id}`}
                                space={space}
                                key={space.slug}
                                disabled={isJoining}
                                loading={isJoiningThisSpace}
                                onPress={() => {
                                    getDataandJoin(space);
                                }}
                            />
                        );
                    })}
                </>
            )}

        <Spacer height={ItemHeight.xsmall} />

            {currentUser && currentUser.email && (
                <Text
                    text={t('Using account: {{email}}', {
                        email: currentUser.email,
                    })}
                    light
                    small
                />
            )}
    </Page>;
};

export const navigationOptions = ({navigation}: any) => {
    historyService.setNavigation(navigation);
    return {
        title: i18n.t('AddSpacePage::Add a Space'),
        desktopHeaderType: DesktopHeaderType.plain,
        desktopShowClose: false,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.close)
    }
};

// @ts-ignore
AddSpacePage.navigationOptions = navigationOptions;

// @ts-ignore
AddSpacePage.path = '';

export default withNavigation(AddSpacePage);
