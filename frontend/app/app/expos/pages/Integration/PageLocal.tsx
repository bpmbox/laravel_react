import { withNavigation } from '@react-navigation/core';
import defaultTo from 'lodash/defaultTo';
import get from 'lodash/get';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { FunctionComponent, useCallback, useEffect, useReducer, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import PageRendererLocal, {
    PageProp,
    PAGE_BUTTON_ACTION_EVENT,
    PAGE_BUTTON_CLICK_EVENT,
    PAGE_INPUT_CHANGE_EVENT,
    PAGE_LINK_CLICK_EVENT,
    PAGE_PROVIDER_EVENT,
    PAGE_ACTION_CLICK_EVENT,
    PAGE_INLINE_LINK_CLICK_EVENT,
} from '../../libs/integration/pageRendererLocal';
import { executeEventAction, getEvent as getBlockEvent } from '../../libs/integrations/blocks';
import { defaultStackNavigationOptions } from '../../libs/nav/config';
import { getSecretNavigationVar } from '../../libs/secret-nav-var';
import historyService from '../../services/history';
import integrationService from '../../services/integration';
import messageService from '../../services/message';
import spaceService from '../../services/space';
import { ApolloError } from 'apollo-client';
import { openURL } from '../../libs/linking';
import { getURLScheme, getURLQueryParams } from '../../libs/url-utils';
import AuthStore from '../../store/auth';
//import { PageContext } from '../../pages/PageContextProvider';
//import { log } from '../../services/log/log';

type PageState = {
    page: SpaceServiceTypes.SpacePage | null;
    props: Array<PageProp> | null;
};

type PageAction = {
    type: 'PAGE_LOADED' | 'PROPS_UPDATED';
    page?: SpaceServiceTypes.SpacePage;
    props?: Array<PageProp> | null;
};

export type WithPageProps = {
    pageProps?: Array<PageProp> | null;
};

export type WithEventEmitter = {
    eventEmitter?: EventEmitter;
};

export type WithItem = {
    item?: any | null;
};

export type WithAction = {
    onClick?: Action | null;
    onChange?: Action | null;
    onTick?: Action | null;
    onUserLocationChanged?: Action | null;
    onPresencesUpdated?: Action | null;
};

export type Action = {
    action: string;
    payload?: any | null;
    onSuccess?: Action | null;
    onError?: Action | null;
};

const pageReducer = (state: PageState, action: PageAction): PageState => {
    switch (action.type) {
        case 'PAGE_LOADED':
            return {
                page: action.page || null,
                props: action.page ? action.page.content.props : null,
            };
        case 'PROPS_UPDATED':
            return {
                page: state.page,
                props: action.props || null,
            };
    }
};

/**
 * Displays rendering of an Integration Page.
 */

type TestPageProps = {
    space?: Space;
    integration: NSIntegration.Integration;
    pageId?: string;
    content: any;
} & { navigation: any };
const PageLocal: FunctionComponent<TestPageProps> = props => {
    const { t } = useTranslation('IntegrationPage');
    const { space, integration, pageId } = props;
    const [setError] = useState<{ code?: number; message?: string } | null>(null);
    const [state, dispatch] = useReducer(pageReducer, { page: null, props: null });
    const { navigation } = props;
    const { currentUser } = AuthStore.useContainer();
    global['givenName'] = currentUser.givenName;
    global['familyName'] = currentUser.familyName;
    global['userID'] = currentUser.id;
    //reary use this function to get local data
    const fetchPage = useCallback(
        async (pageId?: string) => {
            if (!space || !integration) {
                return;
            }

            try {
                const page = await spaceService.getPage(space, integration, defaultTo(pageId, null));
                // update state with current content.
                dispatch({
                    type: 'PAGE_LOADED',
                    page: page,
                });
            } catch (e) {
                console.debug('Page error:', e);
                if (e instanceof ApolloError) {
                    //setError({ code, message });
                } else {
                    // @ts-ignore
                    setError({ code: 500, message: `${e}` });
                }
            }
        },
        [integration, setError, space]
    );

    //const { user } = useContext(PageContext);
    useEffect(() => {
        //fetchPageRef.current = fetchPage;
        //return () => {
        //    fetchPageRef.current = null;
        //}
    }, [fetchPage]);
    // Observe pageId to detect redirects.
    useEffect(() => {
        //fetchPageRef && fetchPageRef.current(pageId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageId]);
    // end fetchPage

    // eslint-disable-next-line
    const renderer = new PageRendererLocal(props.content);
    renderer.addListener(PAGE_LINK_CLICK_EVENT, block => console.debug('Clson block', block));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderer.addListener(PAGE_LINK_CLICK_EVENT, (block, computedAttrs) => {
        const pageId = 'PageLocal'; //getComputedOrRawAttrs(block, computedAttrs, 'pageId');
        const integrationId = 'TestPage'; //defaultTo(getComputedOrRawAttrs(block, computedAttrs, 'integrationId'), integration.id);
        if (pageId && integrationId) {
            console.log('LP open page');
            //openPage(pageId, integrationId);
            //return;
        }
        const url = 'https://www.google.com'; //getComputedOrRawAttrs(block, computedAttrs, 'url');
        if (url) {
            openURL(url, '_blank');
        }
    });

    renderer.addListener(PAGE_INLINE_LINK_CLICK_EVENT, urlObject => {
        console.log('click');
        return;
        // eslint-disable-next-line no-unreachable
        const url = get(urlObject, 'url', null);
        if (!url) {
            return;
        }
        const scheme = getURLScheme(url);
        if (!scheme) {
            return;
        }
        const normalizeScheme = scheme.toLowerCase();
        if (normalizeScheme === 'workwell' || normalizeScheme === 'withtree') {
            const params = getURLQueryParams(url);
            const pageId = get(params, 'pageId', null);
            if (pageId) {
                // eslint-disable-next-line no-undef
                //openPage(pageId, integration.id);
            }
        } else {
            openURL(url);
        }
    });

    renderer.addListener(PAGE_BUTTON_ACTION_EVENT, async name => {
        console.log('pagelocal 184 --------------');
        return;
        // eslint-disable-next-line no-unreachable
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = await integrationService.performPageAction(space.id, {
                integrationId: integration.id,
                pageId: '',
                action: name,
                props: state.props,
            });
            //pageContentController(result);
        } catch (error) {
            messageService.sendError(t`Error reaching integration.`);
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderer.addListener(PAGE_BUTTON_CLICK_EVENT, async ({ action, item }) => {
        console.log('PageLocal 203 ---------- ');
        //return
        //executeCommand(action, get(state, 'page.content.blocks', null), item, renderer);
    });

    renderer.addListener(PAGE_INPUT_CHANGE_EVENT, ({ block, newValue }) => {
        //console.dir('PageLocal 207 block' + block);
        //console.log('PageLocaal 210' + state.props);
        //console.log('block');
        //console.log(block);
        //console.log(newValue);
        //console.log(block['attrs']);
        //global[block['attrs'].name] = newValue;
        //console.log('216');
        //console.log(block['attrs'].name);
        //console.log(block['attrs'].hasOwnProperty('name'));
        try {
            if (block.attrs.hasOwnProperty('name')) {
                global['prop']();
                console.log(newValue);
                console.log(block.attrs.name);
                if (block.attrs.name !== 'tags') {
                    global[block.attrs.name] = newValue;
                }

                //if (block['attrs'].name === 'seibetu') {
                //    global[block['attrs'].name] = newValue;
                //}

                if (block.attrs.name === 'tags') {
                    global[block.attrs.name] = [newValue];
                }
            }
        } catch (e) {
            console.log(e);
        }

        //console.log('endblock');
        //console.log('start state');
        //console.log(state);
        //console.log('end state');
        //console.log(state.props.attrs)
        //console.dir(block);
        //console.dir(state.props);
        //console.debug('PageLocal 208 val' + newValue);
        //console.debug('PageLocal 209 localhook');

        //global.teamName = newValue;
        //user.name = newValue + 'PageLocal.tsx 210';

        // eslint-disable-next-line no-unreachable
        if (block.bindToProp && state.props) {
            const newProps = state.props.map((p: PageProp) => {
                console.log(p.name);
                if (p.name === block.bindToProp) {
                    return {
                        ...p,
                        value: newValue,
                    };
                }
                return p;
            });
            // eslint-disable-next-line no-unreachable
            dispatch({
                type: 'PROPS_UPDATED',
                props: newProps,
            });
        }
    });

    renderer.addListener(PAGE_PROVIDER_EVENT, ({ block, name, payload }) => {
        console.log('page privider Event');
        const event = defaultTo(getBlockEvent(block, name), null);
        if (event === null) {
            return;
        }
        const newProps = executeEventAction(event, state.props, payload);
        dispatch({
            type: 'PROPS_UPDATED',
            props: newProps,
        });
    });

    renderer.addListener(PAGE_ACTION_CLICK_EVENT, async ({ action, item }) => {
        console.log('start pageLocal 252 ==================');
        console.log(action);
        console.log(item);
        console.log('navigation');
        //const lg = new log();
        console.debug('■Upload Meta Log PAGE_ACTION_CLICK_EVENT pageLoacal 249 global data update to sendbird');
        //lg.updatemeta(global.conve, global.teamName, global.img);
        navigation.goBack();
    });
    return renderer.render([]);
};

// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
/**
 * Registers appropirate listeners to handle page events.
 * @param renderer
 * @param integration
 * @param navigation
 * @param space
 * @param state
 * @param pageContentController
 * @param t Translation hook
 * @param dispatch Navigation dispatch
 */

export const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);

    const pageTitle = getSecretNavigationVar(navigation, 'pageTitle') || '';

    return {
        title: pageTitle,
        ...defaultStackNavigationOptions,
    };
};

// @ts-ignore
PageLocal.navigationOptions = navigationOptions;

// @ts-ignore
export default withNavigation(PageLocal);
