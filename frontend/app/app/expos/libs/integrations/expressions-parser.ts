import get from 'lodash/get';
import { evalProp } from './operators';
import * as ops from './operators';
import { uncapitalize } from '../string-utils';
import has from 'lodash/has';

const IGNORE_OPERATORS = [
    'evalProp'
];

const operatorDefs = Object.keys(ops).reduce((defs, fullOperatorName) => {
    if (IGNORE_OPERATORS.includes(fullOperatorName)) {
        return defs;
    }
    const operatorName = uncapitalize(fullOperatorName.slice(4));
    defs[fullOperatorName] = {
        // eslint-disable-next-line
        'regexp': new RegExp(`([^a-zA-Z]{1})${operatorName}\\(\|^${operatorName}\\(`,'g'),
        'fn': ops[fullOperatorName]
    }
    return defs;
}, {});

const operatorNames = Object.keys(operatorDefs).join(',');

const operators = Object.keys(operatorDefs).map((key) => {
    return operatorDefs[key].fn;
});

export const evaluateExpression = (expression, pageProps, item, response, error) => {
    //
    // Evaluate an expression, containing strings of the form ${prop("name")}
    // and ${get(dict, 'key')}.
    //
    // Parameters:
    //
    // expression: the expression to evaluate
    // pageProps:  the current page props, which may be needed in order to
    //             evaluate expressions of the form "prop('...')"
    // item:       a payload available to Collection items, allowing to
    //             evaluate expressions of the form "get(item, 'key')"
    // response:   a response object from a fetch action, to be used e.g.
    //             in an onSuccess action, via "get(response, 'key')"
    // error:      an error object from a fetch action, to be used e.g.
    //             in an onError action, via "get(error, 'key')"
    //
    // Currently supported expressions:
    //
    // "${get(item, 'presences')}"
    // "Full name: ${prop('firstName')} ${prop('lastName')}"
    //

    if (typeof expression !== 'string') {
        return expression;
    }

    if (expression.indexOf('${') === -1) {
        // Quickly return original expression if no '${}' is found.
        return expression;
    };

    // Look for '${...}' parts in the expression and evaluate them.
    const regexp = /\${([^}]*)}/g;
    let match = regexp.exec(expression);
    let newExpression = expression;

    while (get(match, '[0]', null) != null && get(match, '[1]', null) != null) {
        const evaluated = evaluateExpressionComponent(match[1], pageProps, item, response, error);

        let evaluatedExpr = '';
        if (!!evaluated) {
            if (typeof evaluated === 'string') {
                evaluatedExpr = evaluated;
            } else {
                evaluatedExpr = JSON.stringify(evaluated);
            }
        }
        newExpression = newExpression.replace(match[0], evaluatedExpr);
        match = regexp.exec(expression);
    }

    const startEndRegexp = /^\${([^}]*)}$/g;
    if (startEndRegexp.test(expression.trim())) {
        try {
            return JSON.parse(newExpression);
        } catch {}
    }
    
    return newExpression;
}

const sanitizeExpression = (expression: string) => {
    // Replace function names (like 'if(') with their sanitized version
    // ('evalIf(') that does not interfere with JavaScript function names.
    return Object.keys(operatorDefs).reduce((partialExpression, key) => {
        return partialExpression.replace(operatorDefs[key]['regexp'], `$1${key}(`);
    }, expression);
}

const evaluateExpressionComponent = (expression, pageProps, item, response, error) => {
    //
    // Evaluate an expression of the form "prop('name')" or "get(dict, 'key')".
    //

    const sanitizedExpression = sanitizeExpression(expression);

    try {
        // eslint-disable-next-line
        return Function(`'use strict';
            return function(get, prop, item, response, error, ${operatorNames}) {
                return ${sanitizedExpression}
            }`)()(
            get,
            evalProp(pageProps),
            item,
            response,
            error,
            ...operators
        );
    } catch (e) {
        // If parsing failed, return expression verbatim.
        console.log("Error parsing", expression, ": ", e);
        return expression;
    }
}

// TODO - Depracate this
export const getPropName = (expression): string | null => {
    // Returns the prop name in an expression of the form '${prop("prop_name")}'.
    const regexp = /^\${prop\(["'`]([^}]*)["'`]\)}$/g;
    let match = regexp.exec(expression);
    while (get(match, '[0]', null) != null && get(match, '[1]', null) != null) {
        return match[1];
    }
    return null;
}

export const getExpressionWithinBraces = (expression): string => {
    const regexp = /^\${([^}]*)}$/g;
    let match = regexp.exec(expression);
    while (get(match, '[0]', null) != null && get(match, '[1]', null) != null) {
        return match[1];
    }
    return null;
}

const attrsKeysToEvaluate = [
    'disabled',
    'label',
    'iconUrl',
    'subtitle',
    'caption',
    'url',
    'pageId',
    'integrationId',
];

export const computeValue = (value, pageProps, item, response, error) => {
    if (typeof value === 'string') {
        return evaluateExpression(value, pageProps, item, response, error);
    } else if (has(value, 'source')) {
        return {
            ...value,
            source: evaluateExpression(value.source, pageProps, item, response, error)
        };
    }
    return value
}

export const computeAttributes = (rawAttributes, pageProps, item, response, error) => {
    let computedAttributes = Object.assign({}, rawAttributes);
    for (let key of attrsKeysToEvaluate) {
        if (key in rawAttributes) {
            computedAttributes[key] = evaluateExpression(rawAttributes[key], pageProps, item, response, error);
        }
    }
    return computedAttributes;
}
