import React, { ReactElement } from 'react';
import AuthStore from './auth';
import MsgStore from './msg';
import AlertStore from './alert';

export default function ApplyStores(props: { children: JSX.Element[] | JSX.Element | string }): ReactElement {
    return (
        <AuthStore.Provider>
            <MsgStore.Provider>
                <AlertStore.Provider>{props.children}</AlertStore.Provider>
            </MsgStore.Provider>
        </AuthStore.Provider>
    );
}
