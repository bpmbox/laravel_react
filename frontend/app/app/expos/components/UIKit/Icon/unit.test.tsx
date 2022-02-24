import { mount } from 'enzyme';
import React from 'react';
import Avatar from './Avatar';
import { IconSize, IconType } from '../../../theme.style';
import { IconId } from '../../../assets/native/svg-icons';
import Icon from '.';

describe('Icon', (): void => {
    it('renders without issue.', (): void => {
        mount(
            <Icon
                svgIconId={IconId.feather_home_filled_black}
                iconType={IconType.plain}
                iconSize={IconSize.medium}
            />
        );
    });
});

describe('Avatar', (): void => {
    it('renders without issue.', (): void => {
        mount(
            <Avatar
                name={'My name'}
                initial={'A'}
                size={IconSize.small}
                type={IconType.round}
            />
        );
    });
});
