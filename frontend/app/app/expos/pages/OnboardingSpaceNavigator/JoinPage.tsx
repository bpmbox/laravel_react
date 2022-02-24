import { withNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UIKit/items/Button';
import SectionHeading from '../../components/UIKit/items/SectionHeading';
import Spacer from '../../components/UIKit/items/Spacer';
import SpaceSelectorItem from '../../components/UIKit/items/SpaceSelectorItem';
import Text from '../../components/UIKit/items/Text';
import Page from '../../components/UIKit/Layout/Page';
import Spinner from '../../components/UIKit/Spinner';
import i18n from '../../i18n';
import { PARAM_SPACE } from '../../constants';
import routes from '../../routes';
import { ButtonType, ItemWidth } from '../../theme.style';
import authService from '../../services/auth';
import historyService from '../../services/history';
import messageService from '../../services/message';
import spaceService from '../../services/space';
import AuthStore from '../../store/auth';
import { isMobilePlatform } from '../../libs/platform';

const JoinPage = (props: { navigation: any }) => {
    const { navigation } = props;
    const { t } = useTranslation('OnboardingJoinSpacePage');
    const { currentUser } = AuthStore.useContainer();
    const [invitedSpaces, setInvitedSpaces] = useState<Space[]>([]);
    const [isJoining, setIsJoining] = useState<boolean>(false);
    const joiningSpaceRef = useRef<Space>(); // use to track last selected space to join.

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
        if (isMobilePlatform){
            //モバイルアプリの場合はチュートリアル画面へ遷移
            navigation.navigate(routes.ONBOARDING_SPACE_INTRO, {[PARAM_SPACE]: space});
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
            navigation.navigate(routes.MAIN_SPACE_REDIRECT, {
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
        historyService.push(routes.ONBOARDING_SPACE_CREATE);
    };

    const handleLogOut = async () => {
        try {
            await authService.logout();
            historyService.navigateAsRoot(routes.LOGIN_HOME);
        } catch (err) {
            messageService.sendError(t`Error logging out.`);
        }
    };

    return <Page scrollable>
        {count === 0 &&
            <>
                <Text
                    text={t`A space is where your community comes to life. You can create or join other spaces later.`}
                    light
                    small
                    desktopWidth={ItemWidth.narrow}
                    desktopCenterItem={true}
                    />
                <Spacer />
                <Button
                    onPress={handleCreateSpace}
                    text={t`Create a Space`}
                    desktopWidth={ItemWidth.narrow}
                    desktopCenterItem={true}/>
                <Button
                    onPress={handleLogOut}
                    text={t('Switch Account')}
                    type={ButtonType.text}
                    desktopWidth={ItemWidth.narrow}
                    desktopCenterItem={true}/>
            </>
        }

        {count > 0 &&
            <>
                <Button
                    onPress={handleLogOut}
                    text={t('Switch Account')}
                    desktopWidth={ItemWidth.narrow}
                    desktopCenterItem={true}/>
                <SectionHeading
                    text={t`Spaces you've been invited to`}
                    desktopWidth={ItemWidth.narrow}
                    desktopCenterItem={true}
                />
                {isJoining
                    ? <Spinner />
                    : invitedSpaces.map((space: Space) => {
                        return <SpaceSelectorItem
                            testID={`SelectSpace_${space.id}`}
                            space={space}
                            key={space.slug}
                            onPress={() => { getDataandJoin(space) }}
                            desktopWidth={ItemWidth.narrow}
                            desktopCenterItem={true}
                        />
                    })
                }
            </>
        }

        <Spacer/>

        {currentUser && currentUser.email &&
            <Text
                text={t('Using account: {{email}}', {
                    email: currentUser.email,
                })}
                light
                small
                desktopWidth={ItemWidth.narrow}
                desktopCenterItem={true}
            />
        }
    </Page>;
};

JoinPage.navigationOptions = {
    title: i18n.t('JoinPage::Add a Space'),
};

// @ts-ignore
JoinPage.path = 'join'; //override path for better web URLs

export default withNavigation(JoinPage);
