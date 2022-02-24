import get from 'lodash/get';
import find from 'lodash/find';
import messageService from '../../services/message';
import { evaluateExpression } from './expressions-parser';
import defaultTo from 'lodash/defaultTo';
import routes from '../../routes';
import { openURL } from '../../libs/linking';
import { executeAction } from './blocks';
import getTranslate from '../get-translate';
//import AuthStore from '../../store/auth';

const { t } = getTranslate('NameSpace')

export const getEvaluatedPayload = (payload, key, pageProps, item, response, error) => {
    const rawPayload = get(payload, key, null);
    if (!rawPayload) {
        return null;
    }
    if (typeof rawPayload === 'string') {
        return evaluateExpression(rawPayload, pageProps, item, response, error);
    } else {
        try {
            const tempRawPayload = Object.assign(rawPayload);
            for (let key of Object.keys(rawPayload)) {
                tempRawPayload[key] = evaluateExpression(rawPayload[key], pageProps, item, response, error);
            }
            return tempRawPayload;
        } catch {}
    }
    return null;
}

export const executeNotifyAction = (payload, pageProps, item, response, error) => {
    const message = getEvaluatedPayload(payload, 'message', pageProps, item, response, error);
    if (!message) {
        return;
    }
    switch (get(payload, 'type', null)) {
        case 'error': messageService.sendError(message); break;
        default: messageService.sendMessage(message); break;
    }
}

export const executeOpenAction = (payload, pageProps, item, response, error, integration, navigation) => {
    const pageId = getEvaluatedPayload(payload, 'pageId', pageProps, item, response, error);
    const integrationId = defaultTo(getEvaluatedPayload(payload, 'integrationId', pageProps, item, response, error), integration.id);
    if (pageId && integrationId) {
        navigation.navigate({
            routeName: routes.INTEGRATIONS_NATIVE,
            params: {
                integrationId: integrationId,
                pageId: pageId
            },
            key: pageId,
        });
        return;
    }
    const url = getEvaluatedPayload(payload, 'url', pageProps, item, response, error);
    if (url) {
        openURL(url, '_blank');
    }
}

export const executeUpdatePropsAction = (payload, pageProps, item, response, error, dispatch) => {
    const propsToUpdate = get(payload, 'props', []);
    if (!Array.isArray(propsToUpdate)) {
        return;
    }
    const updatedProps = pageProps.map((pageProp) => {
        const propToUpdate = find(propsToUpdate, (p) => p.name === pageProp.name);
        if (!propToUpdate) {
            return pageProp;
        }
        const newValue = getEvaluatedPayload(propToUpdate, 'newValue', pageProps, item, response, error);
        return {
            ...pageProp,
            value: newValue
        }
    });
    dispatch({
        type: 'PROPS_UPDATED',
        props: updatedProps
    });
}

export const executeFetchAction = async (payload, pageProps, item, response, error, onSuccess, onError, integration, navigation, dispatch) => {
    const url = getEvaluatedPayload(payload, 'url', pageProps, item, response, error);
    if (!url) {
        return;
    }
    try {
        const result = await fetch(url);
        const response = await result.json();
        if (onSuccess) {
            executeAction(onSuccess, pageProps, item, response, null, integration, navigation, dispatch);
        }
    } catch (e) {
        if (onError) {
            const error = {
                'message': t`Error fetching data.`
            }
            executeAction(onError, pageProps, item, null, error, integration, navigation, dispatch);
        }
    }
}

export const executePostAction = async (payload, pageProps, item, response, error, onSuccess, onError, integration, navigation, dispatch) => {
console.log("Post Start");
    const url = getEvaluatedPayload(payload, 'url', pageProps, item, response, error);
    if (!url) {
        return;
    }
    try {
        const params = getEvaluatedPayload(payload, 'params', pageProps, item, response, error);
        console.log(params);
        if(params.userName === ""){
            params.userName = global['givenName'] + global['familyName'];
        }
        console.log(params);
        console.debug('action.ts 115 params ' + params);
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        });
        const r = await result.json();
        if (onSuccess) {
            executeAction(onSuccess, pageProps, item, r, null, integration, navigation, dispatch);
        }
    } catch (e) {
        if (onError) {
            const error = {
                'message': get(e, 'message', t`Error performing the request.`)
            }
            executeAction(onError, pageProps, item, null, error, integration, navigation, dispatch);
        }
    }
}
