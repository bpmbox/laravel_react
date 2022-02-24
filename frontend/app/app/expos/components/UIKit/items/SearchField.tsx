import React, { FunctionComponent } from 'react';
import { ItemHeight, BackgroundType, HorizontalOffset } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import omit from 'lodash/omit';

type SearchFieldProps = {
    legend?: boolean
} & ItemProps;

const SearchField: FunctionComponent<SearchFieldProps> = (props) => {
    return <Item
        height={ItemHeight.default}
        backgroundType={BackgroundType.wideButton}
        leftTextOffset={HorizontalOffset.large}
        leftTextInput
        numberOfLines={1}
        {...omit(props, 'legend')} />
};

export default SearchField;
