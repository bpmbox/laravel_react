import { withNavigation } from '@react-navigation/core';
import { TFunction } from 'i18next';
import defaultTo from 'lodash/defaultTo';
import get from 'lodash/get';
import React, { FunctionComponent, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageRenderer, {
    PageProp,
    PAGE_BUTTON_ACTION_EVENT,
    PAGE_BUTTON_CLICK_EVENT,
    PAGE_INPUT_CHANGE_EVENT,
    PAGE_LINK_CLICK_EVENT,
    PAGE_PROVIDER_EVENT,
    PAGE_ACTION_CLICK_EVENT,
    PAGE_INLINE_LINK_CLICK_EVENT,
} from '../../libs/integration/pageRenderer';
import { executeCommand, executeEventAction, getEvent as getBlockEvent, executeAction } from '../../libs/integrations/blocks';
import { defaultStackNavigationOptions } from '../../libs/nav/config';
import { getSecretNavigationVar, setSecretNavigationVar } from '../../libs/secret-nav-var';
import useElementMountedRef from '../../libs/use-element-mounted-ref';
import routes from '../../routes';
import historyService from '../../services/history';
import integrationService from '../../services/integration';
import messageService from '../../services/message';
import spaceService from '../../services/space';
import ErrorPage from '../General/ErrorPage';
import FullPageLoading from '../General/FullPageLoading';
import { ApolloError } from 'apollo-client';
import { openURL } from '../../libs/linking';
import { getURLScheme, getURLQueryParams} from '../../libs/url-utils';
import chatService from '../../services/chat';
//chatService.nativeOnlyRegisterAnalitics("analiticskkkkkktest");
type IntegrationPageProps = {
    space?: Space;
    integration: NSIntegration.Integration;
    pageId?: string;
} & { navigation: any };

type PageState = {
    page: SpaceServiceTypes.SpacePage | null,
    props: Array<PageProp> | null
};

type PageAction = {
    type: 'PAGE_LOADED' | 'PROPS_UPDATED';
    page?: SpaceServiceTypes.SpacePage;
    props?: Array<PageProp> | null;
}

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
}

const pageReducer = (state: PageState, action: PageAction): PageState => {
    switch (action.type) {
        case 'PAGE_LOADED':
            return {
                page: action.page || null,
                props: action.page ? action.page.content.props : null
            };
        case 'PROPS_UPDATED':
            return {
                page: state.page,
                props: action.props || null
            };
    }
};

const getDisplayErrorCode = (fullCode) => {
    // Full code can be either of the form XXX-YYY-ZZZ or YYY.
    // In the first case, return the code itself. In the second case,
    // return the middle part, YYY.
    const fullStringCode = `${defaultTo(fullCode, 404)}`;
    const stringCode = get(fullStringCode.split('-'), '[1]', fullStringCode);
    try {
        return parseInt(stringCode);
    } catch {
        return 404;
    }
}

/**
 * Displays rendering of an Integration Page.
 */
const IntegrationPage: FunctionComponent<IntegrationPageProps> = (props) => {
    const { t } = useTranslation('IntegrationPage');
    const { navigation, space, integration, pageId } = props;
    const [error, setError] = useState<{ code?: number, message?: string } | null>(null);
    const [state, dispatch] = useReducer(pageReducer, { page: null, props: null });
    const [renderer, setRenderer] = useState<PageRenderer | null>(null);
    const pageMountedRef = useElementMountedRef();
    //chatService.nativeOnlyRegisterAnalitics("analiticsIntegration");

    const hanZen = (str) => {
        return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    }



    // -- Init / Observers --

    // Fetches initial content and Observes changes in pageId param, and fetches updated content.
    const fetchPage = useCallback(async (pageId?: string) => {
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
                const message = get(e, 'graphQLErrors[0].message') || t`Unable to load the page.`;
                const code = getDisplayErrorCode(get(e, 'graphQLErrors[0].extensions.code', 500));
                setError({code, message});
            } else {
                setError({ code: 500, message: `${e}` })
            }
        }
    }, [integration, space, t]);
    // A ref is used to fetchPageRef to ensure we use the freshest fetchPage() definition
    // is called by our observers.
    const fetchPageRef = useRef<CallableFunction>();
    useEffect(() => {
        fetchPageRef.current = fetchPage;
        return () => {
            fetchPageRef.current = null;
        }
    }, [fetchPage]);
    // Observe pageId to detect redirects.
    useEffect(() => {
        fetchPageRef && fetchPageRef.current(pageId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageId]);
    // end fetchPage

    // -- Pure Observers --
    // Observe changes in the page and update the title props.
    useEffect(() => {

        let title = get(state.page, 'content.title', '');
        let integrationName = get(integration, 'name', '');
        setSecretNavigationVar(navigation, 'pageTitle', title, pageMountedRef);
        setSecretNavigationVar(navigation, 'integrationName', integrationName, pageMountedRef);


        if (get(state, 'page.content', null) !== null) {
            const renderer = new PageRenderer(state.page.content);
            const pageContentController = createPageContentController(navigation, integration);
            //add by miyata
            //2020/11/30 .mot service preview Error . replace . to ""

            //chatService.nativeOnlyRegisterAnalitics("set analitics");

            title = title.replace(".","")
            title = title.replace(".","")

            console.log("title check ==="+title)
            title = hanZen(title)
            console.log(title)

            //chatService.nativeOnlyRegisterAnalitics("get json");

            let pageIdb = JSON.stringify(pageId);
            //Sconsole.log(pageIdb.length)

            //chatService.nativeOnlyRegisterAnalitics("set json");

            //chatService.nativeOnlyRegisterAnalitics(typeof pageId);



            console.log(typeof pageId)
            if(typeof pageId == "object"){
                //chatService.nativeOnlyRegisterAnalitics("object");
                pageIdb = "json"
            }

            if(pageIdb !== undefined){
                pageIdb = hanZen(pageIdb)
                pageIdb = pageIdb.replace("$","").replace("@","").replace("、","").replace(".","").replace("#","").replace("(","").replace(")","").replace("[","").replace("]","").replace("//","")
            }

            //if(pageIdb != "undefined"){
            //    pageIdb = hanZen(pageIdb)
            //}

            if(typeof pageId !== "object"){
                console.log("----------------------------- not object --------------------------------")
                try{
                    //chatService.nativeOnlyRegisterAnalitics("■0 "+title);

                    //chatService.nativeOnlyRegisterAnalitics("■5 "+
                    //   title+"■"+
                    // space.id+"■"+pageIdb);

                    chatService.nativeOnlyRegisterAnalitics(title,space.id,integration.id,pageIdb);
                    //title+"-"+


                    //chatService.nativeOnlyRegisterAnalitics("■2 "+
                    //title+"-"+
                    //integration.id+"_"+pageIdb);


                    //chatService.nativeOnlyRegisterAnalitics("■3 "+
                    //title+"-"+
                    //space.id+"-"
                    //+pageIdb);

                    //chatService.nativeOnlyRegisterAnalitics_event("nativeOnlyRegisterAnalitics_event",title,space.id,integrationName);
                }catch(err){
                    chatService.nativeOnlyRegisterAnalitics("err"+err,"","","");

                }

            }
            initContentRenderer(
                renderer,
                integration,
                navigation,
                space,
                state,
                pageContentController,
                t,
                dispatch
            );

            setRenderer(renderer);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [integration, state.page, state.props]);

    // -- Render --
    if (error !== null) {
        return <ErrorPage code={error.code} message={error.message} />
    }

    if (!state.page || !renderer) {
        return <FullPageLoading />
    }

    return renderer.render(state.props);
};

/**
 * Wires up Page Actions to their corresponding handlers.
 * @param navigation
 * @param integration
 */
function createPageContentController(navigation: any, integration: NSIntegration.Integration) {
    return (result: any) => {
        const notification = get(result, 'notification', null);
        // Send notification after handling.
        if (notification !== null) {
            messageService.sendMessage(notification);
        }

        const code = get(result, 'code', 200);
        switch (code) {
            case 200:
                break;

            case 301:
                const pageId = get(result, 'pageId', null);

                if (!!pageId) {
                    navigation.navigate({
                        routeName: routes.INTEGRATIONS_NATIVE,
                        params: {
                            integrationId: integration.id,
                            pageId: pageId
                        },
                        key: `${integration.id}.${pageId}`,
                    });
                }
                else {
                    // This is when we navigate across integrations such as via
                    // sidebar in web. In this case, pageId is not available in
                    // the path.
                    navigation.navigate({
                        routeName: routes.INTEGRATIONS_NATIVE_SELECTED_INTEGRATION,
                        params: {
                            integrationId: integration.id,
                        },
                        key: `${integration.id}`,
                    });
                }
                break;
            default:
                console.warn('Unknown result type encountered', result);
        }
    };
}

const getComputedOrRawAttrs = (block, computedAttrs, name) => {
    return get(computedAttrs, name, get(block, name, null));
}

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
function initContentRenderer(
    renderer: PageRenderer,
    integration: NSIntegration.Integration,
    navigation: any,
    space: Space,
    state: PageState,
    pageContentController: (result: any) => void,
    t: TFunction,
    dispatch: React.Dispatch<PageAction>
) {
    renderer.removeAllListeners(PAGE_LINK_CLICK_EVENT);
    renderer.removeAllListeners(PAGE_BUTTON_ACTION_EVENT);
    renderer.removeAllListeners(PAGE_BUTTON_CLICK_EVENT);
    renderer.removeAllListeners(PAGE_INPUT_CHANGE_EVENT);
    renderer.removeAllListeners(PAGE_PROVIDER_EVENT);
    renderer.removeAllListeners(PAGE_ACTION_CLICK_EVENT);
    renderer.removeAllListeners(PAGE_INLINE_LINK_CLICK_EVENT);

    const openPage = (pageId, integrationId) => {
        //chatService.nativeOnlyRegisterAnalitics(routes.INTEGRATIONS_NATIVE);
        navigation.navigate({
            routeName: routes.INTEGRATIONS_NATIVE,
            params: {
                integrationId: integrationId,
                pageId: pageId
            },
            key: pageId,
        });
    }

    renderer.addListener(PAGE_LINK_CLICK_EVENT, (block, computedAttrs) => {
        const pageId = getComputedOrRawAttrs(block, computedAttrs, 'pageId');
        const integrationId = defaultTo(getComputedOrRawAttrs(block, computedAttrs, 'integrationId'), integration.id);
        if (pageId && integrationId) {
            openPage(pageId, integrationId);
            return;
        }
        const url = getComputedOrRawAttrs(block, computedAttrs, 'url');
        if (url) {
            openURL(url, '_blank');
        }
    });

    renderer.addListener(PAGE_INLINE_LINK_CLICK_EVENT, (urlObject) => {
        const url = get(urlObject, 'url', null);
        if (!url) {
            return;
        }
        const scheme = getURLScheme(url);
        if (!scheme) {
            return
        }
        const normalizeScheme = scheme.toLowerCase();
        if (normalizeScheme === 'workwell' || normalizeScheme === 'withtree') {
            const params = getURLQueryParams(url);
            const pageId = get(params, 'pageId', null);
            if (pageId) {
                openPage(pageId, integration.id);
            }
        } else {
            openURL(url);
        }
    });

    renderer.addListener(PAGE_BUTTON_ACTION_EVENT, async (name) => {
        try {
            const result = await integrationService.performPageAction(space.id, {
                integrationId: integration.id,
                pageId: '',
                action: name,
                props: state.props
            });
            pageContentController(result);
        } catch (error) {
            messageService.sendError(t`Error reaching integration.`);
        }
    });

    renderer.addListener(PAGE_BUTTON_CLICK_EVENT, async ({ action, item}) => {
        executeCommand(action, get(state, 'page.content.blocks', null), item, renderer);
    });

    renderer.addListener(PAGE_INPUT_CHANGE_EVENT, ({ block, newValue }) => {
        if (block.bindToProp && state.props) {
            const newProps = state.props.map((p: PageProp) => {
                if (p.name === block.bindToProp) {
                    return {
                        ...p,
                        value: newValue
                    }
                }
                return p;
            });
            dispatch({
                type: 'PROPS_UPDATED',
                props: newProps
            });
        }
    });

    renderer.addListener(PAGE_PROVIDER_EVENT, ({ block, name, payload }) => {
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

    renderer.addListener(PAGE_ACTION_CLICK_EVENT, async ({ action, item}) => {
        executeAction(action, state.props, item, null, null, integration, navigation, dispatch);
    });
}

export const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);

    const pageTitle = getSecretNavigationVar(navigation, 'pageTitle') || '';

    return {
        title: pageTitle,
        ...defaultStackNavigationOptions,
    };
};

// @ts-ignore
IntegrationPage.navigationOptions = navigationOptions;

export default withNavigation(IntegrationPage);
