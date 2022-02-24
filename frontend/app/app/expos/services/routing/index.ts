import get from 'lodash/get';
import { Linking, Platform } from 'react-native';
import Route from 'route-parser';
import { default as UrlParse } from 'url';
import { PARAM_REDIRECT } from '../../constants';
import i18n from '../../i18n';
import { default as NativeRoutes } from '../../routes';
import authService, { LoginState } from '../auth';
import historyService from '../history';
import messageService from '../message';
import universalLinks from './univeral-links';
//import firebase from 'react-native-firebase';

/**
 * Mapping universal link to the appropriate Native routes.
 * Note: this should be ordered by precedence.
 */
const ROUTE_MAPPINGS = [
    {
        web: universalLinks.LOGIN_VALIDATE,
        native: NativeRoutes.LOGIN_ENTER_LOGIN_CODE,
    },
    {
        web: universalLinks.JOIN,
        native: NativeRoutes.SPACE_INVITE,
        authenticatedRoute: true,
    },
    {
        web: universalLinks.CHANGE_EMAIL_CODE,
        native: NativeRoutes.CHANGE_EMAIL_CODE,
        authenticatedRoute: true,
    },
    {
        web: universalLinks.IMPERSONATE,
        native: NativeRoutes.IMPERSONATE,
    },
    {
        web: universalLinks.INTEGRATION_INDEX_PAGE,
        native: NativeRoutes.INTEGRATIONS_NATIVE_INDEX,
        authenticatedRoute: true,
    },
    {
        web: universalLinks.INTEGRATION_PAGE,
        native: NativeRoutes.INTEGRATIONS_NATIVE,
        authenticatedRoute: true,
    },
];

// Non-space subdomains
const NONSPACE_SUBDOMAINS = ['www', 'dev-app', 'qa-app', 'stage-app', 'next-app', 'dev', 'qa', 'stage', 'next'];

// Level 1 domains: we do not want to trigger the direction if the request is not come from sub domain
const ROOT_DOMAINS = [
    'chat.dreamso.net',
    '35.72.50.16',
    '35.72.50.16:9007',
    'withtree',
    'localhost',
    '13.112.27.42',
    'bpms.bpmboxes.com',
    '3000-salmon-skink-1ejkoj9z.ws-us09.gitpod.io',
];

/**
 * Handles incoming URL events for mobile app and redirects to appropriate page.
 */
export class RoutingService {
    _initialUrl: string = null;

    /**
     * Initializes RoutingService to handle incoming universal links.
     */
    init(): void {
        Linking.addEventListener('url', this._handleUrlEvent.bind(this));
    }

    /**
     * Checks to see whether app was initially loaded via a deep-link URL,
     * and, if so, goes to the appropriate route.
     * This is needed on Android only.
     */
    async checkInitialUrl(): Promise<boolean> {
        if (Platform.OS !== 'android') {
            return false;
        }
        try {
            this._initialUrl = await Linking.getInitialURL();
            console.log('RoutingService initial url:', this._initialUrl);
            if (this._initialUrl) {
                this.goToRoute(this._initialUrl);
                return true;
            }
        } catch (err) {
            console.warn('Error with deep-link initialization:', err);
        }
        return false;
    }

    hasInitialUrl(): boolean {
        return this._initialUrl !== null;
    }

    goToRoute(url: string): void {
        console.debug('Universal link received:', url);

        let match: RouteMatch;
        try {
            match = this.__matchRoute(url);
        } catch (err) {
            messageService.sendError(err.message);
            return;
        }

        // Special case for Login, If we are on the enter code page currently, then
        // just do a replace to populate the params.
        if (
            match.nativeRoute === NativeRoutes.LOGIN_ENTER_LOGIN_CODE &&
            historyService.currentRouteName === NativeRoutes.LOGIN_ENTER_LOGIN_CODE &&
            match.params.hasOwnProperty('email')
        ) {
            const { email, code } = match.params as {
                email: string;
                code: string;
            };
            return historyService.replace(NativeRoutes.LOGIN_ENTER_LOGIN_CODE, {
                email: email,
                code: code,
            });
        } else if (match.nativeRoute === NativeRoutes.LOGIN_ENTER_LOGIN_CODE && !match.params.hasOwnProperty('email')) {
            return historyService.navigateAsRoot(NativeRoutes.LOGIN);
        }

        // If not authenticated route, redirect to Login with a redirect param passed in.
        if (match.authenticatedRoute && authService.getLoginState() !== LoginState.LOGGED_IN) {
            return historyService.navigateAsRoot(NativeRoutes.LOGIN, {
                [PARAM_REDIRECT]: url,
                ...match.params,
            });
        }

        // Special case for email verification code universal link:
        // If we are already on the relevant page, just insert/replace
        // the appropriate parameters on the existing page.
        if (
            match.nativeRoute === NativeRoutes.CHANGE_EMAIL_CODE &&
            historyService.currentRouteName === NativeRoutes.CHANGE_EMAIL_CODE &&
            match.params.hasOwnProperty('email') &&
            match.params.hasOwnProperty('code')
        ) {
            return historyService.replace(historyService.currentRouteName, match.params);
        }

        // Replace if the current route matches the request route to reload the screen
        if (match.nativeRoute === historyService.currentRouteName) {
            return historyService.replace(match.nativeRoute, match.params);
        }

        // If everything is ok, navigate to the route as root navigator.
        // Note: we are using root navigator in this case to avoid the issue where we can
        // be stuck inside a nested stack that doesn't support our route.
        return historyService.navigateAsRoot(match.nativeRoute, match.params);
    }

    getQueryParam(navigation: null | any, paramName: string, defaultValue: any = null) {
        // In some cases (e.g. when make the direction by code: window.location.href, we do not
        // pass by navigation so it does not know about the query params state => might be a bug
        // So if we cannot parse the param from navigation then try to parse it from current query string
        let paramValue = navigation && navigation.getParam(paramName);

        if (!paramValue && Platform.OS === 'web') {
            const parsed = UrlParse.parse(window.location.href, true);
            paramValue = get(parsed, `query.${paramName}`);
        }

        return paramValue || defaultValue;
    }

    /**
     * Event listener.
     * @param event
     */
    _handleUrlEvent(event: { url: string }) {
        this.goToRoute(event.url);
    }

    /**
     * Tries to find the best matched routes along with their params.
     * @param url
     */
    __matchRoute(url: string): RouteMatch | null {
        let matchingRouteParams: object | false = false; // false indicates no match.
        let nativeRoute: string = '';
        let query: object | null = null;
        const parsedUrl = UrlParse.parse(url, true);

        // If there is no path, then it's not possible to handle this route.
        if (!parsedUrl.pathname) {
            throw new Error(i18n.t('RoutingService::{{url}} is not accessible.', { url }));
        }

        // loop over our supported routes to find first match.
        for (let routePair of ROUTE_MAPPINGS) {
            const route = new Route(routePair.web);
            matchingRouteParams = route.match(parsedUrl.pathname);
            query = parsedUrl.query;

            nativeRoute = routePair.native;
            if (matchingRouteParams) {
                break;
            }
        }

        // if we had a route match from above loop, return the parsed route.
        if (matchingRouteParams) {
            return {
                nativeRoute: nativeRoute,
                params: {
                    ...query,
                    ...matchingRouteParams,
                },
            };
        }

        // If we cannot find an entry in the routing table, then we'll just attempt to
        // open it as a native route.
        return {
            nativeRoute: parsedUrl.pathname,
            params: parsedUrl.query,
            authenticatedRoute: true,
        };
    }

    redirectIfSubDomain() {
        const parsed = UrlParse.parse(window.location.href, false);
        // eslint-disable-next-line
        const { hostname, protocol, port } = parsed;

        // Extract the sub domain (~slug) then redirect user to the right space
        // eslint-disable-next-line
        const mostLeftDomain = hostname.split('.')[0];

        // White list the domains that are not considered as space/slug
        // eslint-disable-next-line
        const WHITELIST_DOMAINS = [...NONSPACE_SUBDOMAINS, ...ROOT_DOMAINS];

        // Handle the sub domain redirection
        // eslint-disable-next-line
        if (!WHITELIST_DOMAINS.includes(mostLeftDomain)) {
            // eslint-disable-next-line
            let newDomain = hostname.replace(`${mostLeftDomain}.`, '');
            // eslint-disable-next-line
            const spaceSlug = mostLeftDomain;

            if (port) {
                newDomain += `:${port}`;
            }

            // TODO: might be in the future, wtypte'd have to handle with path
            // let path = window.location.pathname;
            // if (!path.startsWith(`/${spaceSlug}`)) {
            //     path = `/${spaceSlug}${path}`;
            // }

            //const newLocation = `${protocol}//${newDomain}/${spaceSlug}`;
            //window.location.href = newLocation;
        }
    }
}

type RouteMatch = {
    // the matching native route
    nativeRoute: string;
    // params will have both URL params along with query params merged together.
    // URL params will take precedence over query params.
    params: object;
    authenticatedRoute?: boolean;
};

const routingService = new RoutingService();

export default routingService;
