import get from 'lodash/get';
import { PageProp } from '../integration/pageRenderer';
import { evaluateExpression, getExpressionWithinBraces } from './expressions-parser';
import { EventEmitter } from 'events';
import { executeNotifyAction, executeOpenAction, executeUpdatePropsAction, executeFetchAction, executePostAction } from './actions';

const ACTION_UPDATE_PROPS = 'updateProps';

export const getEventNameForBlockCommand = (blockName) => {
    return `PAGE_COMMAND_${blockName}`.toUpperCase();
}

export const getEvent = (block, eventName) => {
    const events = get(block, 'attrs.events', []);
    if (!Array.isArray(events)) {
        return null;
    }
    return events.find((event) => { return event.name === eventName });
}

export const executeAction = (action, pageProps, item, response, error, integration, navigation, dispatch) => {
    const actionName = get(action, 'action', null);
    const payload = get(action, 'payload', null);
    const onSuccess = get(action, 'onSuccess', null)
    const onError = get(action, 'onError', null)
    switch (actionName) {
        case 'notify': executeNotifyAction(payload, pageProps, item, response, error); break;
        case 'open': executeOpenAction(payload, pageProps, item, response, error, integration, navigation); break;
        case 'updateProps': executeUpdatePropsAction(payload, pageProps, item, response, error, dispatch); break;
        case 'fetch': executeFetchAction(payload, pageProps, item, response, error, onSuccess, onError, integration, navigation, dispatch); break;
        case 'post': executePostAction(payload, pageProps, item, response, error, onSuccess, onError, integration, navigation, dispatch); break;
        default: return;
    }
}

export const executeEventAction = (event, pageProps, item): PageProp[] => {
    //
    // Example action:
    //
    // {
    //     action: 'updateProps',
    //     props: [{
    //         name: 'presences',
    //         new_value: '${get(item, "presences")}'
    //     }]
    // }
    //
    if (get(event, 'action', null) !== ACTION_UPDATE_PROPS) {
        return pageProps;
    }

    const propsToUpdate = get(event, 'props', []);
    if (!Array.isArray(propsToUpdate) || propsToUpdate.length === 0) {
        return pageProps;
    }

    return pageProps.map((prop) => {
        const found = propsToUpdate.find((p) => { return p.name === prop.name });
        if (found) {
            return {
                ...prop,
                value: evaluateExpression(found.newValue, pageProps, item, null, null),
            };
        } else {
            return prop;
        }
    });
}

export const executeCommand = (action: string, blocks: any[] | null, item: any | null, eventEmitter: EventEmitter) => {
    const block = (name) => {
        return blocks.find((block) => block.name === name);
    }

    const call = (block: any | null, command: string, item: any | null) => {
        if (!block || !block.name) {
            return;
        }
        eventEmitter.emit(getEventNameForBlockCommand(block.name), {
            command,
            payload: item
        })
    }

    const expressionToEvaluate = getExpressionWithinBraces(action);

    if (!expressionToEvaluate) {
        return;
    }

    try {
        // eslint-disable-next-line
        Function(`'use strict';return function(block,call,item){return ${expressionToEvaluate}}`)()(block, call, item);
    } catch (err) {
        console.log("Error executing command", err);
    }
}