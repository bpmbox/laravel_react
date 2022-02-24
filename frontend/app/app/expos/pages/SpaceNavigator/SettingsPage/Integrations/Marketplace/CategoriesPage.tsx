
import { withNavigation } from '@react-navigation/core';
import React, { FunctionComponent } from 'react';
import SimpleListItem from '../../../../../components/UIKit/items/SimpleListItem';
import Page from '../../../../../components/UIKit/Layout/Page';
import i18n from '../../../../../i18n';
import { allCategories, Category, categoryIcon, categoryName } from '../../../../../libs/integrations';
import { defaultStackNavigationOptions } from '../../../../../libs/nav/config';
import { PARAM_CATEGORY, PARAM_SPACE } from '../../../../../constants';
import routes from '../../../../../routes';

const CategoriesPage: FunctionComponent<any> = (props) => {
    const { navigation } = props;
    const { space } = navigation.state.params;

    const onCategoryPress = (category: Category) => {
        navigation.navigate(routes.INTEGRATIONS_MARKETPLACE_CATEGORY, {
            [PARAM_SPACE]: space,
            [PARAM_CATEGORY]: category,
        });
    }

    return (
        <Page scrollable>
            {allCategories.map((category: Category, index) =>
                <SimpleListItem
                    key={index}
                    text={categoryName(category)}
                    iconId={categoryIcon(category)}
                    onPress={() => onCategoryPress(category)}
                    large
                />
            )}
        </Page>
    );
};

export const navigationOptions = ({navigation}: any) => {
    return {
        title: i18n.t('CategoriesPage::Categories'),
        ...defaultStackNavigationOptions
    }
};

// @ts-ignore
CategoriesPage.navigationOptions = navigationOptions;

export default withNavigation(CategoriesPage);
