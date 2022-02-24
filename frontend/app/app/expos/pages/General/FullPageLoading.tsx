import React, { FunctionComponent } from 'react';
import Page from '../../components/UIKit/Layout/Page';
import Spinner from '../../components/UIKit/Spinner';


const FullPageLoading: FunctionComponent = () => {
    return <Page center>
        <Spinner />
    </Page>
};

export default FullPageLoading;
