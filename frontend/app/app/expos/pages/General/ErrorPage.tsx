import React, { FunctionComponent } from 'react';
import Page from '../../components/UIKit/Layout/Page';
import Text from '../../components/UIKit/items/Text';
import Spacer from '../../components/UIKit/items/Spacer';
import { useTranslation } from 'react-i18next';
import defaultTo from 'lodash/defaultTo';

type ComponentProps = {
    code?: number;
    message?: string;
};

const Component: FunctionComponent<ComponentProps> = (props) => {
    const { t } = useTranslation('ErrorPage');
    return <Page center>
        <Text text={`${defaultTo(props.code, 404)}`} extralight bold large center narrow />
        <Spacer />
        <Text text={defaultTo(props.message, t`Page not found.`)} narrow small center />
    </Page>
};

export default Component;
