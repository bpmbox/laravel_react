import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import { IconPosition, IconSize, IconType, ItemHeight, IconBackgroundType } from '../../../theme.style';
import { IconId } from '../../../assets/native/svg-icons';
import omit from 'lodash/omit';

type CenteredLargeIconProps = {
    iconId: IconId
} & ItemProps;

const CenteredLargeIcon: FunctionComponent<CenteredLargeIconProps> = (props) => {
    return <Item
        height={ItemHeight.xlarge}
        leftIconId={props.iconId}
        leftIconSize={IconSize.large}
        leftIconType={IconType.rounded}
        leftIconBackgroundType={IconBackgroundType.plainLight}
        leftIconPosition={IconPosition.horizontalCenter}
        centerContent
        {...omit(props, 'iconId')}
    />
};

export default CenteredLargeIcon;
