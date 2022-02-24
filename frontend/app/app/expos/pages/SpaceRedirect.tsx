import { withNavigation } from '@react-navigation/core';
import React, { FunctionComponent, useEffect } from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { PARAM_SLUG, PARAM_SPACE } from '../constants';
import getDefaultEntrySpace from '../libs/get-default-entry-space';
import routes from '../routes';
import historyService from '../services/history';
import spaceService from '../services/space';
import AuthStore from '../store/auth';
import FullPageLoading from './General/FullPageLoading';

type SpaceNavigatorWithRouter = FunctionComponent<NavigationInjectedProps> & {
    router?: any;
};

/**
 * This is an entry point for post login when a space is not provided.  The purpose of this page
 * is to redirect the user to a space he last viewed, or a space he is subscribed to if the last
 * viewed page is not available.
 * @param props
 */
const SpaceRedirect: SpaceNavigatorWithRouter = props => {
    const { currentUser, isLoading } = AuthStore.useContainer();
    const { navigation } = props;

    // These are 2 possible navigation parameters received from a redirect.
    // Create, Join, or Switch space
    const targetSpace: Space | string | null = navigation.getParam(PARAM_SPACE);
    // Universal link
    const targetSlug: string | null = navigation.getParam(PARAM_SLUG);

    const processSpaceRouter = async () => {
        console.debug('SpaceRedirect: Space change or init detected');
        let space: Space | null = null;

        // First priority, look for space param indicating a redirect to this page.
        // Note: on a webroute, sometimes params get converted into strings.
        // This use case corrresponds to Space Switcher and Create Space Page where
        // those pages will pass a Space as a param.
        if (targetSpace && typeof targetSpace !== 'string') {
            console.debug('SpaceRedirect: using target space:', targetSpace);
            space = targetSpace as Space;
        }

        // 2nd priority - Get by slug (this corresponds to use cases where we may be redirected via web)
        // Although rare, can happen if the URL is captured while redirection is in progress, but not
        // yet completed.
        if (!space && targetSlug) {
            console.debug('Received slug, fetching space by slug');

            try {
                const spaceInfo: SpaceServiceTypes.SpaceInfo | null = await spaceService.getInfoBySlug(targetSlug);

                if (!spaceInfo) {                    
                } else {
                    space = spaceInfo.space;
                }
            } catch (e) {
                console.error(e);                
            }
        }

        // Get the user's normal entry space.
        if (!space) {
            space = await getDefaultEntrySpace(currentUser);
        }

        if (space) {
            console.debug('Everything is ok, goto space:', space.slug);
            historyService.navigateAsRoot(routes.MAIN, {
                [PARAM_SLUG]: space.slug,
            });
        } else {
            // Navigate to join page so user can select a space they can join.
            console.debug('No possible space to redirect to.');
            historyService.navigateAsRoot(routes.ONBOARDING_SPACE);
        }
    };

    useEffect(() => {
        if (isLoading) {
            return;
        }
        processSpaceRouter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    return <FullPageLoading />;
};

// @ts-ignore
SpaceRedirect.path = 'space/redirect'; //override path for better web URLs

export default withNavigation(SpaceRedirect);
