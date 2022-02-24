import { NavigationActions, StackActions, NavigationContainerComponent, NavigationAction } from 'react-navigation';

export class HistoryService {
    __navigation: any | null = null;
    __rootNavigation: NavigationContainerComponent | null = null;

    hasNavigation(): boolean {
        return this.__navigation !== null;
    }

    setNavigation(navigation?: any): void {
        this.__navigation = navigation;
    }

    setRootNavigation(navigationRef: NavigationContainerComponent | null): void {
        this.__rootNavigation = navigationRef;
        this.__navigation = navigationRef;
    }

    /**
     * Called when a modal closes; sends a result back to the parent.
     * The result appears in the parent's props as a "returnValue" parameter.
     */
    finishWithResult(returnValue: object): void {
        if (!this.__navigation) {
            return;
        }

        console.log('→ FINISH WITH RESULT', returnValue);
        console.log('historyService finishWithResult: nav=', this.__navigation);
        console.log('historyService finishWithResult: returnValue=', returnValue);

        if (typeof this.__navigation.dangerouslyGetParent !== 'undefined') {
            const parent = this.__navigation.dangerouslyGetParent();
            console.log('parent = ', parent);
            if (parent) {
                parent.setParams({
                    returnValue: returnValue,
                });
            }
        } else {
            console.log('historyService finishWithResult: no parent :-(');
            this.__navigation.setParams({
                returnValue: returnValue,
            });
        }
        this.goBack();
    }

    goBack(result?: any): void {
        if (!this.__navigation) {
            return;
        }

        console.log('← BACK');
        this.__navigation.dispatch(NavigationActions.back(result));
    }

    /**
     * Called when a modal closes; sends a result back to the parent.
     * The modal calls the onFinish function that was passed to pushModal
     * by the parent previously.
     */
    goBackModal(returnValue: object): void {
        if (!this.__navigation) {
            console.warn('goBackModal: Missing navigator, Did we forget to pass ref to historyService?');
            return;
        }

        const onFinish =
            this.__navigation.state &&
            this.__navigation.state.params &&
            this.__navigation.state.params.historyService_onFinish;
        if (onFinish) {
            onFinish(returnValue);
        } else {
            console.warn('goBackModal: Missing onFinish, Did we forget to call pushModal?');
        }
        this.goBack();
    }

    push(route: string, params?: any, key?: string): void {
        if (!this.__navigation) {
            console.warn('Missing navigator, Did we forget to pass ref to historyService?');
            return;
        }

        let navigationAction: NavigationAction;
        // determine if this is a stack navigator by checking the push prop
        if (this.__navigation.push) {
            navigationAction = StackActions.push({
                routeName: route,
                params: params,
                key: key,
            });
        } else {
            // Fall back to navigate if it is not a stack navigator.
            navigationAction = NavigationActions.navigate({
                routeName: route,
                params: params,
                key: key,
            });
        }

        console.log('→ PUSH ' + route, params || '{}');
        this.__navigation.dispatch(navigationAction);
    }

    /**
     * Similar to push(...) but expects a result to be returned.
     * When the given modal route finishes, its result is passed to the given onFinish function.
     */
    pushModal(route: string, onFinish: (returnValue: any) => void, params?: any, key?: string): void {
        if (!this.__navigation) {
            console.warn('pushModal: Missing navigator, Did we forget to pass ref to historyService?');
            return;
        }

        console.log('→ PUSH MODAL ' + route, params || '{}');

        // insert a parameter named 'historyService_onFinish' containing
        // the callback to execute in goBackModal when the modal closes
        this.__navigation.dispatch(
            NavigationActions.navigate({
                routeName: route,
                params: {
                    ...params,
                    historyService_onFinish: onFinish,
                },
                key: key,
            })
        );
    }

    reset(route: string, params?: any | null): void {
        if (!this.__navigation) {
            console.warn('reset: Missing navigator, Did we forget to pass ref to historyService?');
            return;
        }

        console.log('→ RESET ' + route, params);
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: route,
                    params: params,
                }),
            ],
        });
        this.__navigation.dispatch(resetAction);
    }

    replace(routeName: string, params?: any | null): void {
        if (!this.__navigation) {
            console.warn('replace: Missing navigator, Did we forget to pass ref to historyService?');
            return;
        }

        console.log('→ REPLACE ' + routeName);
        const replaceAction = StackActions.replace({
            routeName: routeName,
            params: params,
        });
        this.__navigation.dispatch(replaceAction);
    }

    navigateAsRoot(routeName: string, params?: object, nextAction?: any, key?: string): void {
        // TODO: Comment this log for now, uncomment only when needed
        // console.debug(
        //     'Navigate as root',
        //     'routeName:',
        //     routeName,
        //     'params:',
        //     params || {},
        //     'navigator: ',
        //     this.__rootNavigation
        // );
        if (this.__rootNavigation) {
            this.__rootNavigation.dispatch(
                NavigationActions.navigate({
                    routeName,
                    params,
                    action: nextAction,
                    key: key
                })
            );
        }
    }

    // This does the same thing as currentRouteName
    // but sometimes, we do not need to setNavigation
    // so this is the safe method to parse currentRouteName from navigation
    getCurrentRouteNameFromNavigation(navigation: any): string | null {
        const nav = navigation.state.nav;

        if (!nav) {
            return null;
        }

        let currentRoute: any = nav.routes[nav.index];
        let routeName = null;
        let isMaxDepth = false;

        while (!isMaxDepth) {
            if (currentRoute.routes) {
                currentRoute = currentRoute.routes[currentRoute.index];
            }

            if (currentRoute.routeName) {
                routeName = currentRoute.routeName;
            }

            if (!currentRoute.routes) {
                isMaxDepth = true;
            }
        }

        return routeName;
    }

    get currentRouteName(): string | null {
        if (!this.__rootNavigation) {
            return null;
        }

        return this.getCurrentRouteNameFromNavigation(this.__rootNavigation);
    }
}

const historyService = new HistoryService();

export default historyService;
