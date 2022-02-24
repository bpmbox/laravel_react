import React, { FunctionComponent } from 'react';
import Page from '../../components/UIKit/Layout/Page';
import Text from '../../components/UIKit/items/Text';
import { useTranslation } from 'react-i18next';
import defaultTo from 'lodash/defaultTo';

type EmptyPageProps = {
    message?: string;
    subtext?: string;
};

const EmptyPage: FunctionComponent<EmptyPageProps> = (props) => {
    const { t } = useTranslation('ErrorPage');
    return <Page center>
        <Text text={defaultTo(props.message, t`No results.`)} narrow small center />
        { defaultTo(props.subtext, '') !== '' && 
            <Text text={props.subtext} narrow small light center />
        }
    </Page>
};

export default EmptyPage;
