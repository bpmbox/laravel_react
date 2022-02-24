import React, { FunctionComponent } from 'react';
import { popProps } from '../../../libs/data-utils/object-utils';
import { FontSize, FontWeight, ItemHeight, lineHeight, VerticalOffset } from '../../../theme.style';
import Item, { ItemProps } from '../Item';

type SectionHeadingProps = {} & ItemProps;

const SectionHeading: FunctionComponent<SectionHeadingProps> = props => {
    const [{ text, desktopWidth, desktopCenterItem }] = popProps(props, 'text', 'desktopWidth', 'desktopCenterItem');

    return (
        <Item
            text={text}
            textSize={FontSize.normal}
            textWeight={FontWeight.bold}
            topTextOffset={VerticalOffset.xlarge}
            height={ItemHeight.flex}
            lineHeight={lineHeight(FontSize.normal)}
            textNumberOfLines={0}
            desktopWidth={desktopWidth}
            desktopCenterItem={desktopCenterItem}
        />
    );
};

export default SectionHeading;
