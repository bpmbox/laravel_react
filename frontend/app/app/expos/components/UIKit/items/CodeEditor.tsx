import React, { FunctionComponent } from 'react';
import { ItemHeight, VerticalPosition, VerticalOffset, FontSize } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import { countLines } from '../../../libs/string-utils';

type CodeEditorProps = {} & ItemProps;

const CodeEditor: FunctionComponent<CodeEditorProps> = (props) => {
    const height = countLines(props.value) < 15 ? ItemHeight.embedxsmall : ItemHeight.embedsmall;
    return <Item
        height={height}
        leftTextInput={true}
        textSize={FontSize.small}
        multilineInput
        multiline
        code
        textNumberOfLines={0}
        topTextOffset={VerticalOffset.xxlarge}
        bottomTextOffset={VerticalOffset.xxlarge}
        textPosition={VerticalPosition.top}
        {...props} />
};

export default CodeEditor;
