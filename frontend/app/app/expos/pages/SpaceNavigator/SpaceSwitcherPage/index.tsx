import { withNavigation } from '@react-navigation/core';
import React, { FunctionComponent, useContext, useEffect, useReducer } from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { IconId } from '../../../assets/native/svg-icons';
import { createNavigationOptions, ModalButtonType } from '../../../components/Navigation/NavButtons';
import NavButton from '../../../components/UIKit/Button/NavButton';
import SpaceSelectorItem from '../../../components/UIKit/items/SpaceSelectorItem';
import Page from '../../../components/UIKit/Layout/Page';
import Row from '../../../components/UIKit/Layout/Row';
import Spinner from '../../../components/UIKit/Spinner';
import i18n from '../../../i18n';
import { defaultStackNavigationOptions } from '../../../libs/nav/config';
import { PARAM_SPACE } from '../../../constants';
import routes from '../../../routes';
import historyService from '../../../services/history';
import spaceService, { SPACES_UPDATED_EVENT } from '../../../services/space';
import trackingService from "../../../services/tracking";
import AuthStore from "../../../store/auth";
import { SpaceContext } from '../SpaceContext';

const RETRY_INTERVAL = 10000; // 10 seconds.
type SpaceSwitcherState = {
    loading: boolean;
    error: boolean;
    spaces: Space[] | null;
};

type SpaceSwicherAction = {
    type: 'SPACES_LOADED' | 'SPACES_UPDATED' | 'SPACES_LOADING_ERROR' | 'RETRY';
    spaces?: Space[];
};

const spaceSwicherReducer = (
    state: SpaceSwitcherState,
    action: SpaceSwicherAction
): SpaceSwitcherState => {
    switch (action.type) {
        case 'SPACES_LOADED':
            return {
                loading: false,
                error: false,
                spaces: action.spaces as Space[],
            };
        case 'SPACES_LOADING_ERROR':
            return {
                loading: false,
                error: true,
                spaces: null,
            };
        case 'SPACES_UPDATED':
            return {
                loading: false,
                error: false,
                spaces: action.spaces as Space[],
            };
        case 'RETRY':
            return {
                loading: true,
                error: false,
                spaces: null,
            };

        default:
            return state;
    }
};

type SpaceSwitcherProps = {
    /** Active Space */
    activeSpace: Space;
} & NavigationInjectedProps;

const SpaceSwitcherPage: FunctionComponent<SpaceSwitcherProps> = (props: SpaceSwitcherProps) => {
    const { navigation } = props;
    const { currentUser } = AuthStore.useContainer();

    const [state, dispatch] = useReducer(spaceSwicherReducer, {
        loading: true,
        error: false,
        spaces: null,
    });

    const { space: activeSpace } = useContext(SpaceContext);

    const fetchSpaces = () => {
        spaceService
            .getSpaces()
            .then(spaces => {
                dispatch({
                    type: 'SPACES_LOADED',
                    spaces: spaces,
                });
            })
            .catch(err => {
                console.error(
                    'error fetching spaces in SpaceSwicherView on native',
                    err
                );
                dispatch({
                    type: 'SPACES_LOADING_ERROR',
                });
            });
    };

    useEffect(() => {
        fetchSpaces();
        spaceService.addListener(SPACES_UPDATED_EVENT, fetchSpaces);
        return () => {
            spaceService.removeListener(SPACES_UPDATED_EVENT, fetchSpaces);
        };
    }, []);

    // Monitors the state and retries if there is an error.
    useEffect(() => {
        if (state.loading || !state.error) {
            return;
        }

        // Initiate retrying if we detect an Error and loading is completed.
        setTimeout(() => {
            fetchSpaces();
        }, RETRY_INTERVAL);

        dispatch({ type: 'RETRY' });
    }, [state.error, state.loading]);

    // -- Handlers --
    const handleSpaceSelect = async (space: Space) => {
        await trackingService.reportSpaceVisit(currentUser.id, space);
        navigation.navigate(routes.MAIN_SPACE_REDIRECT, { [PARAM_SPACE]: space });
    };

    const handleSpaceSettingsPress = async (space: Space) => {
        navigation.navigate(routes.SETTINGS_SPACE_MENU, {
            [PARAM_SPACE]: space
        });
    };

    // -- Rendering --
    if (state.loading || state.error) {
        return <Spinner />;
    }

    return <Page scrollable>
        {(state.spaces as Space[]).map(space => (
            <SpaceSelectorItem
                key={space.id}
                space={space}
                selected={
                    (activeSpace && activeSpace.id === space.id) || false
                }
                onSettingsPress={() => handleSpaceSettingsPress(space)}
                onPress={() => handleSpaceSelect(space)} />
        ))}
    </Page>;
};

/**
 * Actions that appear in the header of the SpaceSwicher
 * @param props
 */
export const SpaceSwitcherHeaderRight = (props: {
    onAdd: () => any;
    onSettings: () => any;
}) => (
    <Row>
        <NavButton
            extra
            iconId={IconId.feather_plus_stroke_accent4}
            onPress={() => props.onAdd()}
        />
        <NavButton
            iconId={IconId.feather_settings_stroke_accent4}
            onPress={() => props.onSettings()}
        />
    </Row>
);

// @ts-ignore
SpaceSwitcherPage.navigationOptions = createNavigationOptions(
    i18n.t('SpaceSwitcher::Spaces'),
    ModalButtonType.close,
    {
        ...defaultStackNavigationOptions,
        headerRight: () => (
            <SpaceSwitcherHeaderRight
                onAdd={() => historyService.push(routes.JOIN_SPACE)}
                onSettings={() => historyService.push(routes.SETTINGS)}
            />
        )
    }
);

export default withNavigation(SpaceSwitcherPage);
