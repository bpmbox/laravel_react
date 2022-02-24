import { withNavigation } from '@react-navigation/core';
import get from 'lodash/get';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import UserPickerModal from '../../components/integration/blocks/input/UserPickerModal';
import { PARAM_REDIRECT, PARAM_SLUG, PARAM_SPACESWITCHER_HIDE_HEADER_BUTTONS } from '../../constants';
import getDefaultEntrySpace from '../../libs/get-default-entry-space';
import { createStackNavigator } from '../../libs/nav/navigators';
import { isMobilePlatform } from '../../libs/platform';
import { slugBlacklist } from '../../libs/space-validators/slug-blacklist';
import useListener from '../../libs/use-listener';
import routes from '../../routes';
import historyService from '../../services/history';
import messageService from '../../services/message';
import spaceService, { SPACES_UPDATED_EVENT } from '../../services/space';
import trackingService from '../../services/tracking';
import AuthStore from '../../store/auth';
import { Role } from '../../types/enums';
import FullPageLoading from '../General/FullPageLoading';
import { withInitChat, withInitChatHandleAppState } from './chat-controller';
import CreateChatPage from './CreateChatPage';
import ConversationSettingsPage from './MainTabPage/ChatPage/ConversationSettingsPage';
import GroupPickerPage from './GroupPickerPage';
import JoinSpacePage from './JoinSpacePage';
import MainTab from './MainTabPage';
import CreateChannelPage from './MainTabPage/ChatPage/CreateChannelPage';
import PeoplePickerPage from './PeoplePickerPage';
import SettingsPage from './SettingsPage';
import IntegrationAccessPickerPage from './SettingsPage/Integrations/Installed/AccessPickerPage';
import ConfigureIntegrationPage from './SettingsPage/Integrations/Installed/ConfigurePage';
import IntegrationInfoPage from './SettingsPage/Integrations/Marketplace/InfoPage';
import ChangeRolePage from './SettingsPage/People/ChangeRolePage';
import CreateUserGroupPage from './SettingsPage/People/CreateUserGroupPage';
import InvitePage from './SettingsPage/People/InvitePage';
import UserGroupDetailsPage from './SettingsPage/People/UserGroupDetailsPage';
import { SpaceContext } from './SpaceContext';
import SpaceSwitcherPage from './SpaceSwitcherPage';
import DatePickerPage from '../GeneralPurposeModals/DatePickerPage';

// Internal to attempt to refetch the space behind the scenes, if we
// encounter an error with fetching space.
const SPACE_FETCH_ERROR_RELOAD_INTERVAL = 10000; // 10 seconds.
/**
 * ROUTEPAGE
 */
const ModalStack = createStackNavigator(
    {
        [routes.MAIN_TAB]: {
            screen: MainTab,
            navigationOptions: {
                header: null,
            },
            path: '',
        }, // Tabbed stack that displays sub pages.
        [routes.SPACE_SWITCHER]: {
            screen: SpaceSwitcherPage,
            navigationOptions: ({ navigation }: any) => {
                const navOptions: any = {};

                // Hide header when SpaceSwitcher is entered from a non-return path
                // such as leaving or deleting a space.
                const hideBack = navigation.getParam(PARAM_SPACESWITCHER_HIDE_HEADER_BUTTONS);
                if (hideBack) {
                    navOptions.headerLeft = null;
                    navOptions.headerRight = null;
                }

                return navOptions;
            },
        },
        [routes.CREATE_CHAT]: CreateChatPage,
        [routes.CREATE_CHANNEL]: CreateChannelPage,
        [routes.CONVERSATION_SETTINGS_MODAL]: ConversationSettingsPage,
        [routes.JOIN_SPACE]: JoinSpacePage,
        [routes.SETTINGS]: SettingsPage,
        [routes.SETTINGS_SPACE_PEOPLE_CHANGE_ROLE]: ChangeRolePage,
        [routes.SETTINGS_SPACE_PEOPLE_INVITE]: InvitePage,
        [routes.SETTINGS_SPACE_PEOPLE_CREATE_USER_GROUP]: CreateUserGroupPage,
        [routes.SETTINGS_SPACE_PEOPLE_USER_GROUP_DETAILS]: UserGroupDetailsPage,
        [routes.INTEGRATIONS_CONSOLE_CONFIGURE_INTEGRATION]: ConfigureIntegrationPage,
        [routes.INTEGRATIONS_CONSOLE_ACCESS_PICKER]: IntegrationAccessPickerPage,        
        [routes.PEOPLE_PICKER]: PeoplePickerPage,
        [routes.GROUP_PICKER]: GroupPickerPage,
        [routes.DATE_PICKER]: DatePickerPage,
        [routes.USER_PICKER]: UserPickerModal,
        [routes.INTEGRATIONS_MARKETPLACE_INFO]: IntegrationInfoPage,
    },
    {
        mode: 'modal',
        initialRouteName: routes.MAIN_TAB,
    }
);

export type SpaceContextState = {
    space: Space | null;
    role: Role | null;
};

const ModalStackWithContext = (props: { navigation: any } & any) => {
    const { t } = useTranslation('SpaceNavigator');
    const { currentUser, isLoading: authLoading } = AuthStore.useContainer();
    const { navigation } = props;
    const refreshRef = useRef<ReturnType<typeof setTimeout>>();

    // -- state vars --
    const [isChatServiceReady, setIsChatServiceReady] = useState(false);
    const [spaceContextState, setSpaceContextState] = useState<SpaceContextState>({
        space: null,
        role: null,
    });

    // -- Computed Properties --
    const slug: string | null = props.navigation.getParam(PARAM_SLUG);
    const spaceId: string | null = spaceContextState.space ? spaceContextState.space.id : null;
    // used to determine if we need to reload our space context (user navigated to another slug)
    const slugNotLoaded = !spaceContextState.space && slug;
    const hasSlugChanged =
        // change triggered by init (space is currently null)
        slugNotLoaded ||
        // If space not already load, treat it as the slug changing.
        !spaceContextState.space ||
        // change triggered by outside navigation replacing the slug.
        spaceContextState.space.slug !== slug;
    const slugNotValid = !slug || slugBlacklist.includes(slug);

    const fetchSpace = useCallback(
        async (payload: any | null = null) => {
            try {
                let spaceInfo: SpaceServiceTypes.SpaceInfo;
                if (!slug || slugNotValid) {
                    // Slug missing means that we entered via email link that's modal not
                    // tied to s space.  But we want to attempt to load a an entry space
                    // behind the scene so when they exit a modal, they'll immediately be
                    // in a space.

                    //Note: we check the slug blacklist because those values are not considered valid slugs.

                    spaceInfo = await getEntrySpace(currentUser, spaceInfo);
                } else if (hasSlugChanged) {
                    // Slug has changed, signaling we have navigated to a different page, or
                    // The slug on the current space has been updated.  Either way, we want to
                    // load the freshest info on the target slug.
                    spaceInfo = await spaceService.getInfoBySlug(slug);
                } else if (spaceContextState.space) {
                    // this was triggered by a SPACES_UPDATED event, so we don't know
                    // what changed yet.  Let's try to figure out what changed and handle
                    // appropriately.

                    spaceInfo = await getUpdatedSpace(payload, spaceContextState, spaceInfo);

                    if (spaceInfo === null) {
                        return; // the space info update in this case could not be handled.
                    }
                } else {
                    // No change.
                    return;
                }

                if (!spaceInfo) {
                    console.debug('Space not found: navigating to space redirect');
                    historyService.navigateAsRoot(routes.MAIN_SPACE_REDIRECT);
                    return;
                }

                // If we do not have access to this pace.  Redirect to Invitation page.
                // (aka: ConfirmJoinPage)  role==undefined means we are denied access.
                if (!spaceInfo.role) {
                    // For avoiding the loop in case of user's lastVisitedSpace becomes inaccessible
                    await trackingService.removeLastVisitedSpace(currentUser.id);

                    historyService.navigateAsRoot(routes.SPACE_INVITE, {
                        [PARAM_SLUG]: spaceInfo.space.slug,
                    });
                    return;
                }

                const oldSlug = spaceContextState.space && spaceContextState.space.slug;
                console.debug('SpaceNavigator Setting space context');
                setSpaceContextState({
                    space: spaceInfo.space,
                    role: spaceInfo.role,
                });
                await trackingService.reportSpaceVisit(currentUser.id, spaceInfo.space);

                // Update displayed slug in URL if space update changed the slug.
                if (spaceInfo.space && oldSlug !== spaceInfo.space.slug) {
                    navigation.setParams({
                        [PARAM_SLUG]: spaceInfo.space.slug,
                    });
                }
            } catch (err) {
                messageService.sendError(t`Unable to fetch space. Please verify your network and reload the app.`);
                console.error('SpaceNavigator error fetching space', err);

                // Schedule refetching the space.
                refreshRef.current = setTimeout(() => {
                    fetchSpace(payload);
                }, SPACE_FETCH_ERROR_RELOAD_INTERVAL);
            }
        },
        [currentUser, hasSlugChanged, navigation, slug, spaceContextState, t, slugNotValid]
    );

    useEffect(() => {
        // Wait until we are authenticated or not before fetching space info.
        if (authLoading) {
            return;
        }

        // We are not logged in, redirect to login and try to redirect user to requested space after login
        if (!currentUser) {
            let params = {};

            if (slug) {
                params[PARAM_REDIRECT] = `${routes.MAIN_SPACE_REDIRECT}?slug=${slug}`;
            }

            const routeAfterLogout = isMobilePlatform ? routes.LOGIN_HOME : routes.APP_ENTRY_POINT;
            historyService.navigateAsRoot(routeAfterLogout, params);
            return;
        }

        // Handle user navigating to this page directly via web.
        if (slugNotLoaded || hasSlugChanged || slugNotValid) {
            fetchSpace();
        } else {
            // Space is already loaded, no further actions needed.
        }

        return () => {
            // Clear any pending refresh
            clearTimeout(refreshRef.current);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authLoading, currentUser, slug, slugNotValid]);

    useListener(spaceService, SPACES_UPDATED_EVENT, fetchSpace);
    // Note: not needed since SPACES_UDPATED_EVENT also emitted.
    // useListener(spaceService, SPACES_USER_ROLE_UPDATED_EVENT, fetchSpace);

    // Initialize chat connection
    /**
     *  Setup the connection to the chat service backend
     */
    withInitChatHandleAppState(); // function must start with 'with' since this is a hook.
    const initChatService = withInitChat(spaceContextState, t, currentUser, setIsChatServiceReady);
    /**
     * Update space when an event changes, or when space is initially loaded from params.
     */
    useEffect(() => {
        if (!spaceId || !currentUser) {
            return;
        }
        initChatService();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spaceId, currentUser]);

    // -- Render --

    if (!isChatServiceReady) {
        return <FullPageLoading />;
    }

    const addFlex = { flex: 1 };
    return (
        <>
            <View style={addFlex}>
                <SpaceContext.Provider
                    value={{
                        space: spaceContextState.space,
                        role: spaceContextState.role,
                    }}>
                    <ModalStack testID={'ModalStack'} navigation={props.navigation} />
                </SpaceContext.Provider>
            </View>
        </>
    );
};

async function getUpdatedSpace(
    payload: any,
    spaceContextState: SpaceContextState,
    spaceInfo: SpaceServiceTypes.SpaceInfo
) {
    if (get(payload, 'leftSpace.id', null) === spaceContextState.space.id) {
        // In case of leaving a space, we have addition payload: {leftSpace: space}
        // so if user leaves a space then we do nothing and let the navigation handle the redirect
    } else if (get(payload, 'deletedSpace.id', null) === spaceContextState.space.id) {
        // In case of deleting a space, we have addition payload: {deletedSpace: space}
        // so if user deletes a space then we do nothing and let the navigation handle the redirect
    } else {
        // In case of creating a new space, we have addition payload: {createdSpace: space}
        // so if user creates a space then get that space info directly
        const spaceId = get(payload, 'createdSpace.id', spaceContextState.space.id);
        spaceInfo = await spaceService.getInfoById(spaceId);
    }
    return spaceInfo;
}

async function getEntrySpace(currentUser: User, spaceInfo: SpaceServiceTypes.SpaceInfo) {
    const entrySpace = await getDefaultEntrySpace(currentUser);
    spaceInfo = await spaceService.getInfoBySlug(entrySpace.slug);
    return spaceInfo;
}

ModalStackWithContext.router = ModalStack.router;

// @ts-ignore
ModalStackWithContext.path = ':slug'; // override path for better web URLs

export default withNavigation(ModalStackWithContext);
