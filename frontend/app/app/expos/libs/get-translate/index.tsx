import React from 'react';
import { Trans, TransProps } from 'react-i18next';
import i18n from '../../i18n';

// DL - Since this is a higher order function that returns a component, rather than a pure component,
// I've put it under /libs instead of /components.

type TransComponent = (props: TransProps) => React.ReactElement;
type TransFunc = (message: string | TemplateStringsArray, ...args: any[]) => string;

/**
 * Factor for creating <Trans> component with a given name space.
 * @param namespace
 *
 * Usage:
 * ```
 *  const { T } = getTranslate('PageName');
 *  const { t } = getTranslate('PageName');
 *
 *  const headingText = t('Edit {{userName}}', { userName: user.firstName });
 *
 *  return (
 *      <h1>{headingText}</h1>
 *      <div><T>Hello world</T></div>
 *  )
 * ```
 */
export default function getTranslate(namespace: string): { t: TransFunc; T: TransComponent } {
    // creating a higher order function to wrap with namespace.
    const wrappedTranslateFunc = (message: string | TemplateStringsArray, ...args: any[]): string => {
        // check if namespace is in string to be translated.
        if (/^\w+::/.test(message.toString())) {
            return i18n.t(message, ...args);
        } else {
            return i18n.t(`${namespace}::${message}`, ...args);
        }
    };

    // Creating wrapped Trans component with default to namespace.
    const WrappedTrans = (props: TransProps): React.ReactElement => {
        return (
            <Trans ns={props.ns || namespace} {...props}>
                {props.children}
            </Trans>
        );
    };

    return {
        t: wrappedTranslateFunc,
        T: WrappedTrans,
    };
}
