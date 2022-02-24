import { NavigationScreenProp } from "react-navigation";
import get from 'lodash/get';
import set from 'lodash/set';
import debounce from 'lodash/debounce';
import { RefObject } from "react";
import isEqual from 'lodash/isEqual'
//uncommnet
//import chatService, { CHAT_EVENTS } from '../../services/chat';
// Dictionary store that stores vars.
const valueStore = {};

// Debounce is used because we may be setting many properties in a row
// on the same event queue.
const debouncedNotify = debounce((navigation, componentMountedRef?: RefObject<any>) => {
    // Because of the very small delay to coelece updates.  It's possible a component
    // could be unmounted during this time.  So we can optionally do a check to see
    // a Ref to the calling component to see if it is mounted.
    if (componentMountedRef && !componentMountedRef.current) {
        return;
    }

    navigation.setParams(navigation.state.params);
}, 200, { trailing: true, maxWait: 1000 });

/**
 * Sets a variable inside the navigation state, but not tied to navigation params.  Use this
 * to pass variables between 2 navigation components that use the same navigation.
 * @param navigation react-navigation navigation prop
 * @param key look up key to set
 * @param value new value to set
 * @param componentMountedRef component useRef() to prevent setting value on dismount.
 */
export function setSecretNavigationVar(
    navigation: NavigationScreenProp<any>,
    key: string,
    value: any,
    componentMountedRef?: RefObject<any>
) {
    // check if value is different to prevent unecessary rerendering.
    const storeKey = getStoreKey(navigation, key);
    const oldValue = getSecretNavigationVar(navigation, storeKey);

    // Note: do a safe shallow compare since object reference can change
    // from rerenders.
    if (isEqual(oldValue, value)) {
        return;
    }
    console.debug('Changes secret nav value',
        'old:', oldValue,
        'new:', value);
    //chatService.nativeOnlyRegisterAnalitics(value);    
    set(valueStore, storeKey, value);
//chatService.sendirebase(value);
    // On mobile, set the param secretly behind the scenes to signal 
    // mobile to rerender headers to pickup the new info.
    debouncedNotify(navigation, componentMountedRef);
}

/**
 * Clears a secret navigation var.  To be used for element cleanup where we need to clear keys.
 * @param navigation react-navigation navigation prop
 * @param key value loook up key.
 */
export function clearSecretNavigationVar(
    navigation: NavigationScreenProp<any>,
    key: string
) {
    // check if value is different to prevent unecessary rerendering.
    const storeKey = getStoreKey(navigation, key);
    delete valueStore[storeKey];
}

/**
 * Get a variable inside the navigation state, but not tied to navigation params.  Use this
 * to pass variables between 2 navigation components that use the same navigation.
 * @param navigation 
 * @param key 
 * @param value 
 */
export function getSecretNavigationVar(navigation: NavigationScreenProp<any>, key: string) {
    const storeKey = getStoreKey(navigation, key);
    const value = get(valueStore, storeKey);
    return value;
}

/** 
 * Get a key based on the current route/key.
 * 
 * This is needed because all previous navigations on the stack are active at the same time.
 * We want these values communicated only to the same instance of the SceneView.
 */
function getStoreKey(_navigation: NavigationScreenProp<any>, key: string) {
    //TODO: figure out how to restrict which routes can receive values.
    const storeKey = `${key}`;
    return storeKey;
}
