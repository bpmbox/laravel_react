import React, { FunctionComponent } from 'react';
import Item from '../Item';
import { IconPosition, IconSize, IconType, IconBackgroundType, ItemHeight } from '../../../theme.style';
import { getAvatarProps } from '../../../libs/ui-utils';

type CenteredSpaceIconProps = {
    space: Space
};

const CenteredSpaceIcon: FunctionComponent<CenteredSpaceIconProps> = (props) => {
    return <Item
        height={ItemHeight.xlarge}
        leftIconSize={IconSize.large}
        leftIconType={IconType.rounded}
        leftIconBackgroundType={IconBackgroundType.plainDark}
        leftIconPosition={IconPosition.horizontalCenter}
        centerContent
        {...getAvatarProps(props.space.iconUrl, props.space.name)}
    />
};

export default CenteredSpaceIcon;
