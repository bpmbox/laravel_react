import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import { ItemHeight, FontSize, FontWeight } from '../../../theme.style';
import omit from 'lodash/omit';
import Row from '../Layout/Row';

type DesktopPageHeaderWithNavigationProps = {
    onBackPress?: () => any;
    onForwardPress?: () => any;
    hideBack?: boolean;
    hideForward?: boolean;
} & ItemProps;

const DesktopPageHeaderWithNavigation: FunctionComponent<DesktopPageHeaderWithNavigationProps> = (props) => {
    return <Row style={{ width: '100%' }}>
        <Item
            text={props.text}
            height={ItemHeight.medium}
            textNumberOfLines={1}
            textSize={FontSize.normal}
            textWeight={FontWeight.medium}
            {...omit(props, 'text')} />
    </Row>;
};

export default DesktopPageHeaderWithNavigation;
