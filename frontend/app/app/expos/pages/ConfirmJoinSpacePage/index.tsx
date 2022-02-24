import get from 'lodash/get';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import Button from '../../components/UIKit/items/Button';
import CenteredSpaceIcon from '../../components/UIKit/items/CenteredSpaceIcon';
import Text from '../../components/UIKit/items/Text';
import Page from '../../components/UIKit/Layout/Page';
import { PARAM_SLUG } from '../../constants';
import routes from '../../routes';
import { ButtonType, FontSize, ItemWidth } from '../../theme.style';
import ErrorPage from '../../pages/General/ErrorPage';
import FullPageLoading from '../../pages/General/FullPageLoading';
import historyService from '../../services/history';
import messageService from '../../services/message';
import univeralLinks from '../../services/routing/univeral-links';
import spaceService from '../../services/space';
import authStore from '../../store/auth';

type ConfirmJoinSpacePageState = {
    space: Space | null;
    isMember: boolean;
    isInvited: boolean;
    isLoading: boolean;
    isError: boolean;
};

/**
 * Confirm Join Space Page
 *
 * This is the entry point for an invitation link (universal link).  This page will display the space
 * name and logo, and display a JOIN button that'll allow the user to join this space if he/she has an
 * invitation.
 */
export const ConfirmJoinSpacePage: FunctionComponent<NavigationInjectedProps> = props => {
    const { navigation } = props;
    const { t } = useTranslation('ConfirmJoinSpacePage');
    const {
        isAuthenticated,
        isLoading: authLoading,
    } = authStore.useContainer();

    const slug = navigation.getParam('slug');

    const [isJoining, setIsJoining] = useState<boolean>(false);
    const [state, setState] = useState<ConfirmJoinSpacePageState>({
        space: null,
        isMember: false,
        isInvited: false,
        isLoading: true,
        isError: false,
    });

    // --- Init ---
    useEffect(() => {
        if (authLoading) {
            console.debug('Not yet authenticated.', authLoading, isAuthenticated);
            return; // Not yet logged in.
        }
        if (!authLoading && !isAuthenticated) {
            console.debug('Is not logged in.');
            // Redirect to Login Page with a redirect back to this join page.
            historyService.navigateAsRoot(routes.LOGIN_HOME, {
                redirect: univeralLinks.JOIN.replace(':slug', slug),
            });
            return;
        }

        (async () => {
            try {
                const spaceInfo = await spaceService.getInfoBySlug(slug);

                if (!spaceInfo) {
                    // Space not found
                    setState({
                        space: null,
                        isError: false,
                        isMember: false,
                        isInvited: false,
                        isLoading: false,
                    });
                    return;
                }

                setState({
                    space: spaceInfo.space,
                    isInvited: spaceInfo.invited,
                    isMember: !!spaceInfo.role,
                    isError: false,
                    isLoading: false,
                });
            } catch (err) {
                console.error(
                    'Error occurred while fetching invited state',
                    err
                );
                setState({
                    space: null,
                    isLoading: false,
                    isMember: false,
                    isError: true,
                    isInvited: false,
                });
            }
        })();
    }, [authLoading, isAuthenticated, slug]);

    // -- UI action handers --
    const backToSpaces = () => {
        historyService.navigateAsRoot(routes.MAIN_SPACE_REDIRECT);
    };

    const loginAsDiffUser = () => {
        historyService.navigateAsRoot(routes.LOGIN_HOME, {
            redirect: univeralLinks.JOIN.replace(':slug', slug)
        });
    };

    const handleConfirmJoin = async () => {
        setIsJoining(true);
        try {
            await spaceService.joinSpace(state.space as Space);
            navigation.navigate(
                routes.MAIN_SPACE_REDIRECT,
                { [PARAM_SLUG]: state.space.slug },
            );
        } catch (err) {
            messageService.sendError(t('An error occurred while trying to join {{spaceName}}.', {
                spaceName: get(state, 'space.name', t`the space`),
            }));
        }
        setIsJoining(false);
    };

    // -- Rendering --
    if (authLoading || state.isLoading) {
        return <FullPageLoading />;
    }

    if (state.isError) {
        return (
            <ErrorPage
                message={t(
                    'Common:An Error has occurred. Please try again later.'
                )}
            />
        );
    }

    if (!state.space) {
        console.debug('rendering no such space screen');
        return (
            <ErrorPage
                code={404}
                message={t('Please check your URL and try again.')}
            />
        );
    }

    // Variables to use within rendering
    const brand = t`Brand::Tree`;
    const spaceName = state.space.name;

    if(state.isMember) {
        return (
            <Page verticalCenter>
                <CenteredSpaceIcon space={state.space} />
                <Text
                    markdown
                    text={t(
                        'You are already a member of {{ spaceName }}.',
                        { spaceName }
                    )}
                    textSize={FontSize.large}
                    center
                />
                <Button
                    testID="GoToSpaceButton"
                    text={t('Continue to {{spaceName}}', { spaceName })}
                    onPress={() => {
                        navigation.navigate(routes.MAIN_SPACE_REDIRECT, {
                            [PARAM_SLUG]: state.space.slug,
                        });
                    }}
                    desktopWidth={ItemWidth.narrow}
                    desktopCenterItem={true}
                />
            </Page>
        );
    }

    if (state.isInvited) {
        console.debug('rendering invited screen');
        const welcomeText = t(
            'Welcome to **{{ spaceName }}** on {{ brand }}.',
            { spaceName, brand }
        );
        return (
            <Page verticalCenter>
                <CenteredSpaceIcon space={state.space} />
                <Text
                    markdown
                    text={welcomeText}
                    textSize={FontSize.large}
                    center
                />
                <Button
                    testID="ConfirmJoinButton"
                    text={t('Join {{spaceName}}', { spaceName })}
                    onPress={handleConfirmJoin}
                    desktopWidth={ItemWidth.narrow}
                    desktopCenterItem={true}
                    disabled={isJoining}
                />
            </Page>
        );
    } else {
        // Not invited
        console.debug('rendering not invited screen');
        const notInvitedText = t(
            'You do not have access to **{{ spaceName }}**. Please contact an admin to grant you access.',
            { spaceName }
        );
        return (
            <Page verticalCenter>
                <CenteredSpaceIcon space={state.space} />
                <Text center markdown text={notInvitedText} />
                <Button
                    testID="BackToSpacesButton"
                    text={t('Back to My Spaces')}
                    onPress={backToSpaces}
                    desktopWidth={ItemWidth.narrow}
                    desktopCenterItem={true}
                />
                <Button
                    testID="LoginAsDifferentUserButton"
                    type={ButtonType.text}
                    textSize={FontSize.normal}
                    text={t('Switch Account')}
                    onPress={loginAsDiffUser}
                    desktopWidth={ItemWidth.narrow}
                    desktopCenterItem={true}
                />
            </Page>
        );
    }
};

// @ts-ignore
ConfirmJoinSpacePage.path = 'join/:slug'; //override path for better web URLs

export default withNavigation(ConfirmJoinSpacePage);
