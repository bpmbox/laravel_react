import { withNavigation } from '@react-navigation/core';
import defaultTo from 'lodash/defaultTo';
import slice from 'lodash/slice';
import sortBy from 'lodash/sortBy';
import union from 'lodash/union';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Spacer } from '../../components/integration';
import { getModalHeader, getRightActionHeader, ModalButtonType } from '../../components/Navigation/NavButtons';
import SearchField from '../../components/UIKit/items/SearchField';
import Text from '../../components/UIKit/items/Text';
import UserItem from '../../components/UIKit/items/UserItem';
import Page from '../../components/UIKit/Layout/Page';
import i18n from '../../i18n';
import { defaultStackNavigationOptions } from '../../libs/nav/config';
import useListener from '../../libs/use-listener';
import useQueryPaginationState from '../../libs/use-query-pagination-state';
import useSearch from '../../libs/use-search';
import { DesktopHeaderType, PaddingType } from '../../theme.style';
import historyService from '../../services/history';
import messageService from '../../services/message';
import spaceService, { SPACES_UPDATED_EVENT } from '../../services/space';
import { Role } from '../../types/enums';
import { SpaceContext } from './SpaceContext';
import { PARAM_ON_DONE, PARAM_ON_SELECTION_DONE } from '../../constants';
import { View, Button, StyleSheet } from 'react-native';
import { PageContent } from '../../libs/integration/pageRenderer';
import PageLocal from '../Integration/PageLocal';
import { ItemWidth } from '../../theme.style';
import ImagePicker from '../../components/UIKit/ImagePicker';

const PAGINATION_SIZE = 50;

const BlockGalleryPage = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const content: PageContent = {
        title: 'Basic Blocks',
        props: [
            {
                name: 'firstName',
                type: 'text',
                value: 'store.firstName',
            },
            {
                name: 'lastName',
                type: 'text',
                value: 'store.lastName',
            },
        ],
        blocks: [
            {
                type: 'text',
                value: 'チーム名　必須',
            },
            {
                type: 'input',
                attrs: {
                    placeholder: 'チーム名は必須です',
                    label: '',
                    capitalize: 'characters',
                },
            },
        ],
    };

    return (
        <View style={{ flex: 1, paddingTop: 0 }}>
            <PageLocal content={content} />
        </View>
    );
};

const PeoplePickerPage3 = (props: any) => {
    const { navigation } = props;
    const { space } = useContext(SpaceContext);
    const { onSelectionDone, users, excludedUsers, allowMulti, initialSelection } = navigation.state.params;
    const { t } = useTranslation('PeoplePickerPage');
    const [memberships, setMemberships] = useState<Membership[]>(users || []);
    const [loading, setLoading] = useState<boolean>(false);
    // これがとれてらばいい　コンポーネントを呼び出し　Globalにしてーなー
    const [selection, setSelection] = useState<User[]>(defaultTo(initialSelection, []));

    const { results, setQuery, setData } = useSearch<Membership>([
        { path: 'member.email', weight: 0.4 },
        { path: 'member.givenName', weight: 0.3 },
        { path: 'member.familyName', weight: 0.2 },
        // Full name is a computed value. This is needed for situations we want
        // to search partial match across first and last name.
        { path: 'fullName', weight: 0.1 },
    ]);

    // State to track query entered and pagination
    const { queryState, queryActions } = useQueryPaginationState();

    const fetchMembers = () => {
        (async () => {
            try {
                setLoading(true);
                const members = await spaceService.getMembers(space);
                const excludedUserIds = defaultTo(excludedUsers, []).map(user => {
                    return user.id;
                });
                setMemberships(
                    members.filter(
                        x =>
                            x.role !== Role.INTEGRATION &&
                            !excludedUserIds.includes(x.member.id) &&
                            (x.member.familyName || x.member.givenName)
                    )
                );
            } catch (err) {
                messageService.sendError(t`Unable to retrieve members.`);
            } finally {
                setLoading(false);
            }
        })();
    };

    useEffect(() => {
        if (!users) {
            fetchMembers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useListener(spaceService, SPACES_UPDATED_EVENT, fetchMembers);
    // Note: SPACES_UPDATED_EVENT is also emitted during Role updates, so we
    // don't need to listen on SPACES_USER_ROLE_UPDATED_EVENT
    // useListener(spaceService, SPACES_USER_ROLE_UPDATED_EVENT, fetchMembers);

    // Update search index when data source changes.
    useEffect(() => {
        setData(
            memberships.map(x => ({
                ...x,
                // Create a computed field fullName for our search to index on.
                fullName: `${x.member.givenName} ${x.member.familyName}`,
            }))
        );

        // only run this on memberships changing.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memberships]);

    // Update search query when search input changes.
    useEffect(() => {
        setQuery(queryState.queryString);

        // only run this on querystring change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryState.queryString]);

    const handleSearchInput = (text: string) => {
        queryActions.setQuery(text);
    };

    useEffect(() => {
        navigation.setParams({
            [PARAM_ON_DONE]: () => {
                onSelectionDone && onSelectionDone(selection);
                //navigation.goBack();
            },
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection]);

    const handlePress = (user: User) => {
        if (allowMulti) {
            const exists = typeof selection.find(member => member.id === user.id) !== 'undefined';
            //Get User and put to User array
            if (exists) {
                setSelection(
                    selection.filter(member => {
                        return member.id !== user.id;
                    })
                );
            } else {
                setSelection(union(selection, [user]));
            }
        } else {
            onSelectionDone && onSelectionDone([user]);
            navigation.goBack();
        }
    };

    const onPressLearnMore = () => {
        navigation.state.params[PARAM_ON_DONE] && navigation.state.params[PARAM_ON_DONE]();
    };

    // use all results if search query is empty
    const filteredResults = queryState.queryString ? results : memberships;

    // used for pagination
    const maxPage = Math.ceil(filteredResults.length / PAGINATION_SIZE);

    // Reset pagination page when search results updated.
    useEffect(() => {
        if (queryState.page > maxPage) {
            queryActions.resetPage(maxPage);
        } else {
            queryActions.setMaxPage(maxPage);
        }

        // only run this on match contents changing or page change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredResults, queryState.page]);

    const currentPageResults = sortBy(
        slice(filteredResults, (queryState.page - 1) * PAGINATION_SIZE, queryState.page * PAGINATION_SIZE),
        membership => {
            return membership.member.givenName;
        }
    );

    // @ts-ignore
    return (
        <Page scrollable desktopPadding={PaddingType.horizontalBottom}>
            <View>
                <ImagePicker
                    allowSelection
                    space
                    includeButton
                    buttonTitle={t`Set Logo`}
                    desktopWidth={ItemWidth.narrow}
                    desktopCenterItem={true}
                    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                    onUploaded={(fileUrl: string) => {
                        // eslint-disable-next-line no-undef
                        //setFieldValue('spaceIconUrl', fileUrl);
                    }}
                />
            </View>

            <BlockGalleryPage />
            <View style={styles.button}>
                <Button
                    onPress={() => onPressLearnMore()}
                    title="チーム登録"
                    color="#ffffff"
                    accessibilityLabel="Learn more about this purple button"
                />
            </View>
            <Spacer />
            <SearchField placeholder={t`Filter by name...`} onChangeText={handleSearchInput} autoCapitalize="none" />
            {loading && <Text text={t`Loading space members...`} light small center />}
            {currentPageResults.map((membership, index) => {
                const selected = typeof selection.find(member => member.id === membership.member.id) !== 'undefined';

                return (
                    <UserItem
                        key={index}
                        user={membership.member}
                        onPress={() => handlePress(membership.member)}
                        selected={selected}
                    />
                );
            })}
            {!loading && currentPageResults.length === 0 && (
                <Text
                    text={
                        queryState.queryString.length > 0
                            ? t`No results.`
                            : memberships.length > 0
                            ? t`All members have been added.`
                            : t`No members to add.`
                    }
                    light
                    small
                    center
                />
            )}
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    // If we navigated directly to this dialog, immediately pop to parent so we
    // don't open a role dialog to an stale state.
    if (typeof navigation.getParam(PARAM_ON_SELECTION_DONE) !== 'function') {
        navigation.pop();
        return null;
    }

    historyService.setNavigation(navigation);

    const rightHeader = navigation.state.params.allowMulti
        ? getRightActionHeader(i18n.t('PeoplePickerDone'), true, true, () => {
              navigation.state.params[PARAM_ON_DONE] && navigation.state.params[PARAM_ON_DONE]();
          })
        : {};

    return {
        ...defaultStackNavigationOptions,
        title: navigation.state.params.title,
        desktopHeaderType: DesktopHeaderType.plain,
        ...getModalHeader(ModalButtonType.cancel),
        ...rightHeader,
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 380,
        height: 50,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 3
    },
});

// @ts-ignore
PeoplePickerPage3.navigationOptions = navigationOptions;

// @ts-ignore
export default withNavigation(PeoplePickerPage3);
