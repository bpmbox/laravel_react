
import { withNavigation } from '@react-navigation/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Spacer from '../../../../components/UIKit/items/Spacer';
import SegmentedControl from '../../../../components/UIKit/SegmentedControl';
import i18n from "../../../../i18n";
import { isMobilePlatform } from '../../../../libs/platform';
import { ItemHeight } from '../../../../theme.style';
import historyService from "../../../../services/history";
import PeopleListPage from './PeopleListPage';
import UserGroupsPage from './UserGroupsPage';

const PeoplePage = () => {
    const { t } = useTranslation('PeoplePage');
    
    return (
        <>
            { !isMobilePlatform && <Spacer height={ItemHeight.xsmall} />}
            <SegmentedControl items={[
                {
                    title: t`People`,
                    page: <PeopleListPage />
                },
                {
                    title: t`Groups`,
                    page: <UserGroupsPage />
                }
            ]} />
        </>
    );
};

export const navigationOptions = ({navigation}: any) => {
    historyService.setNavigation(navigation);
    return {
        title: i18n.t('PeoplePage::People'),
    }
};

// @ts-ignore
PeoplePage.navigationOptions = navigationOptions;

// @ts-ignore
PeoplePage.path = 'people'; //override path for better web URLs

export default withNavigation(PeoplePage);
