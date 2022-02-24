import { SceneView } from '@react-navigation/core';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { IconId } from '../../../assets/native/svg-icons';
import SidebarMenuItem from '../../../components/UIKit/items/SidebarMenuItem';
import SidebarSpaceItem from '../../../components/UIKit/items/SidebarSpaceItem';
import Spacer from '../../../components/UIKit/items/Spacer';
import { PARAM_SPACE } from '../../../constants';
import routes from '../../../routes';
import { ItemHeight } from '../../../theme.style';
import historyService from '../../../services/history';
import messageService from '../../../services/message';
import spaceService, { SPACES_UPDATED_EVENT } from '../../../services/space';
import AuthStore from '../../../store/auth';
import { SpaceContext } from '../SpaceContext';

/**
 * サイドバーの設定
 */
const SideBarNavView = ({descriptors, navigation}: any) => {

    const [spaces, setSpaces] = useState<Space[]>([]);
    const { isAuthenticated } = AuthStore.useContainer();
    const activeKey = navigation.state.routes[navigation.state.index].key;
    const descriptor = descriptors[activeKey];
    const { space: activeSpace } = useContext(SpaceContext);

    const switchSpace = (space: Space) => {
        navigation.navigate(routes.MAIN_SPACE_REDIRECT, {
            [PARAM_SPACE]: {
                ...space,
                // Vanity toString method for prettier web URLs
                toString: function () {
                    return this.id;
                },
            },
        });
    };

    // -- Init and Observers --
    const fetchSpaces = async () => {
        // For web we must check since auth service may not have fully initialized yet.
        if(!isAuthenticated || !activeSpace) {
            return;
        }

        try {
            const spaces = await spaceService.getSpaces();
            setSpaces(spaces);
        } catch (e) {
            messageService.sendError(e.message)
        }
    };

    useEffect(() => {
        if(!isAuthenticated || !activeSpace) {
            return;
        }

        fetchSpaces();
        spaceService.addListener(SPACES_UPDATED_EVENT, fetchSpaces);
        return () => {
            spaceService.removeListener(SPACES_UPDATED_EVENT, fetchSpaces);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSpace, isAuthenticated]);

    // -- UI handlers --
    const gotoHome = () => {
        // If we are already home, try set cache buster to force refresh.
        if (navigation.state.routes[navigation.state.index].routeName === routes.TAB_HOME) {
            // Navigate to a copy of the TAB_HOME to return back to entry page.
            navigation.navigate(routes.TAB_HOME + '_');
            return;
        }

        navigation.navigate(routes.TAB_HOME);
    };

    const gotoChat = () => {
        navigation.navigate(routes.TAB_CHAT);
    };

    const gotoWorkspace = () => {
        navigation.navigate(routes.TAB_WORKSPACE);
    };

    const gotoSettings = () => {
        navigation.navigate(routes.TAB_SPACE_SETTINGS);
    };

    const gotoJoinSpace = () => {
        historyService.push(routes.JOIN_SPACE)
    };

    const gotoAccountSettings = () => {
        navigation.navigate(routes.SETTINGS_ACCOUNT_GENERAL_MODAL);
    };
    
    const gotoTeamSetting = () => {
        navigation.navigate(routes.SETTINGS_ACCOUNT_GENERAL_MODAL);
    };



    // If space is not yet loaded, return empty.
    if(spaces.length === 0) {
        return <></>;
    }

    return <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{width: 72, marginTop: 8 }}>
            <ScrollView>
                { spaces.map((space: Space) => {
                    if (space.id === activeSpace.id) {
                        return <View key={space.id}>
                            <SidebarSpaceItem
                                space={space}
                                selected={true}
                                onPress={() => switchSpace(space)}
                            />
                            <SidebarMenuItem
                                iconActive={IconId.feather_home_filled_black}
                                iconInactive={IconId.feather_home_stroke_accent4}
                                active={
                                    activeKey === routes.TAB_HOME ||
                                    activeKey === routes.TAB_HOME + '_'
                                }
                                onPress={gotoHome}
                            />
                            <SidebarMenuItem
                                iconActive={IconId.feather_chat_filled_black}
                                iconInactive={IconId.feather_chat_stroke_accent4}
                                active={activeKey === routes.TAB_CHAT}
                                onPress={gotoChat}
                            />
                            <SidebarMenuItem
                                iconActive={IconId.feather_grid_filled_black}
                                iconInactive={IconId.feather_grid_stroke_accent4}
                                active={activeKey === routes.TAB_WORKSPACE}
                                onPress={gotoWorkspace}
                            />
                            <SidebarMenuItem
                                iconActive={IconId.feather_settings_filled_black}
                                iconInactive={IconId.feather_settings_stroke_accent4}
                                active={activeKey === routes.TAB_SPACE_SETTINGS}
                                onPress={gotoSettings}
                            />
                            <SidebarMenuItem
                                iconActive={IconId.feather_settings_filled_black}
                                iconInactive={IconId.feather_settings_stroke_accent4}
                                active={activeKey === routes.TAB_SPACE_SETTINGS}
                                onPress={gotoSettings}
                            />
                            <Spacer height={ItemHeight.xsmall} />
                        </View>;
                    } else {
                        return <SidebarSpaceItem
                            key={space.id}
                            space={space}
                            selected={false}
                            onPress={() => switchSpace(space)}
                        />
                    }
                })}
                <Spacer height={ItemHeight.xsmall} />
                <SidebarMenuItem
                    iconActive={IconId.feather_plus_stroke_black}
                    iconInactive={IconId.feather_plus_stroke_accent4}
                    onPress={gotoJoinSpace}
                />
            </ScrollView>
            <SidebarMenuItem
                iconActive={IconId.feather_account_stroke_black}
                iconInactive={IconId.feather_account_stroke_accent4}
                onPress={gotoAccountSettings}
            />
            <Spacer height={ItemHeight.xsmall} />
        </View>

        <View style={{flex: 1}}>
            <SceneView
                navigation={descriptor.navigation}
                component={descriptor.getComponent()}
            />
        </View>
    </View>
};

export default SideBarNavView;
