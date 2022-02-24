import React, { FunctionComponent } from 'react';
import { ItemHeight, BackgroundType, HorizontalOffset, VerticalOffset, FontSize, LineHeight, Color } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import { IconId } from '../../../assets/native/svg-icons';
import defaultTo from 'lodash/defaultTo';
import { copyToClipboard } from '../../../libs/clipboard';
import messageService from '../../../services/message';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';

type SnippetProps = {
} & ItemProps;

const Snippet: FunctionComponent<SnippetProps> = (props) => {
    const { t } = useTranslation('Snippet');

    const handleOnCopyToClipboardPress = async () => {
        if (defaultTo(props.text, '').length > 0) {
            copyToClipboard(props.text);
            messageService.sendSuccess(t`Copied to clipboard!`);
        }
    }

    return <Item
        text={i18n.t('$ {{snippet}}', { snippet: props.text })}
        textSelectable={props.textSelectable}
        code
        textNumberOfLines={1}
        textSize={FontSize.small}
        textColor={Color.white}
        lineHeight={LineHeight.normal}
        rightIconId={IconId.feather_copy_stroke_white}
        onRightIconPress={() => handleOnCopyToClipboardPress()}
        backgroundType={BackgroundType.narrow}
        backgroundColor={Color.black}
        leftTextOffset={HorizontalOffset.large}
        rightTextOffset={HorizontalOffset.large}
        topTextOffset={VerticalOffset.xxlarge}
        bottomTextOffset={VerticalOffset.xxlarge}
        height={ItemHeight.flex}
        desktopWidth={props.desktopWidth} />
};

export default Snippet;
