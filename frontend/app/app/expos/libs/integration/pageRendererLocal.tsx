import React, { ReactElement } from 'react';
import { FlatList, View } from 'react-native';
import { EventEmitter } from 'events';
import ErrorPage from '../../pages/General/ErrorPage';
import {
    BulletedList,
    Button,
    Callout,
    Code,
    Collection,
    DatePicker,
    Divider,
    File,
    GoogleMap,
    Heading,
    Image,
    Input,
    Link,
    MultiSelect,
    NumberedList,
    QR,
    Quote,
    SingleSelect,
    Dropdown,
    Spacer,
    Switch,
    Text,
    Typeform,
    UserPicker,
    DatePickerIos,
} from '../../components/integration';
import i18n from '../../i18n';
import { ItemWidth } from '../../theme.style';
import get from 'lodash/get';
import Item from '../../components/UIKit/Item';
import defaultTo from 'lodash/defaultTo';
import { computeAttributes, computeValue } from '../integrations/expressions-parser';
import { Action } from '../../pages/Integration/Page';

// TODO: Should we export it from here, create a types.d.ts, or move this to tree-entities.d.ts file?
type BlockType =
    | 'bulletedlist'
    | 'button'
    | 'callout'
    | 'checkbox'
    | 'code'
    | 'collection'
    | 'comments'
    | 'datepicker'
    | 'datepickerios'
    | 'divider'
    | 'file'
    | 'googlemap'
    | 'heading1'
    | 'heading2'
    | 'heading3'
    | 'heading4'
    | 'heading5'
    | 'heading6'
    | 'image'
    | 'input'
    | 'link'
    | 'multiselect'
    | 'numberedlist'
    | 'paybutton'
    | 'qr'
    | 'quote'
    | 'singleselect'
    | 'dropdown'
    | 'spacer'
    | 'snippet'
    | 'switch'
    | 'text'
    | 'tweet'
    | 'typeform'
    | 'userpicker'
    | 'video';

type PagePropType =
    | 'array'
    | 'boolean'
    | 'date'
    | 'email'
    | 'multiselect'
    | 'number'
    | 'phone'
    | 'url'
    | 'singleselect'
    | 'dropdown'
    | 'text'
    | 'user'
    | 'usergroup';

type Block = {
    name?: string;
    type: BlockType;
    value?: any;
    attrs?: any;
};

export type PageProp = {
    name: string;
    type: PagePropType;
    value?: any | null;
};

export type EventEmitterProps = {
    onPress?: () => void;
    onAction?: (actionName: string) => void;
    onClick?: (action: Action, item?: any) => void;
    onChange?: (newValue: any) => void;
    onProviderEvent?: (event: any) => void;
};

export type PageContent = {
    title?: string;
    props?: Array<PageProp>;
    blocks?: Array<Block>;
};

/* Events */
export const PAGE_LINK_CLICK_EVENT = 'PAGE_LINK_CLICK_EVENT';
export const PAGE_BUTTON_ACTION_EVENT = 'PAGE_BUTTON_ACTION_EVENT';
export const PAGE_BUTTON_CLICK_EVENT = 'PAGE_BUTTON_CLICK_EVENT';
export const PAGE_INPUT_CHANGE_EVENT = 'PAGE_INPUT_CHANGE_EVENT';
export const PAGE_PROVIDER_EVENT = 'PAGE_PROVIDER_EVENT';
export const PAGE_ACTION_CLICK_EVENT = 'PAGE_ACTION_CLICK_EVENT';
export const PAGE_INLINE_LINK_CLICK_EVENT = 'PAGE_INLINE_LINK_CLICK_EVENT';

class PageRendererLocal extends EventEmitter {
    content: PageContent | null;

    constructor(content?: PageContent) {
        super();

        this.content = null;
        if (content) {
            this.content = content;
        }
    }

    render(pageProps: Array<PageProp>, bottomPadding?: number): ReactElement {
        const emptyContent = i18n.t('Errors::This page has no content.');
        if (!this.content) {
            return (
                <ErrorPage
                    code={404}
                    message={emptyContent}
                />
            );
        }

        const statusCode = get(this.content, 'code', 400);
        const message = get(this.content, 'message', emptyContent);
        const blocks = get(this.content, 'blocks', []);

        if (blocks.length === 0) {
            return (
                <ErrorPage
                    code={statusCode}
                    message={message}
                />
            )
        }

        if (blocks.length === 1) {
            const block = blocks[0];
            if (get(block, 'attrs.fullscreen', false)) {
                return <View style={{flex: 1}}>
                    {renderItem(0, this, block, ItemWidth.wide, pageProps)}
                </View>
            }
        }

        return (
            <FlatList
                style={{paddingBottom: defaultTo(bottomPadding, 0) }}
                keyboardDismissMode='on-drag'
                data={blocks}
                keyExtractor={ (_item, index) => index.toString() }
                renderItem={ ({ item }: { item: Block }) =>
                    renderItem(null, this, item, ItemWidth.wide, pageProps, null)
                } />
        );
    }
}

export const renderItem = (
    key: any,
    eventEmitter: EventEmitter,
    block: Block,
    desktopWidth: ItemWidth,
    pageProps?: Array<PageProp>,
    item?: any | null): ReactElement => {
    const computedValue = computeValue(block.value, pageProps, item, null, null);
    const computedAttrs = computeAttributes(defaultTo(block.attrs, {}), pageProps, item, null, null);

    switch (block.type) {
        case 'bulletedlist':
            return <BulletedList
                key={key}
                values={computedValue}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'button':
            return <Button
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                pageProps={pageProps}
                item={item}
                desktopWidth={desktopWidth}
                desktopCenterItem={true}
                onClick={(action) => {
                    eventEmitter.emit(PAGE_ACTION_CLICK_EVENT, { action, item })
                }} />;
        case 'callout':
            return <Callout
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'code':
            return <Code
                key={key}
                value={computedValue}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'collection':
            return <Collection
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                pageProps={pageProps}
                eventEmitter={eventEmitter}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'datepicker':
            return <DatePicker
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                desktopWidth={desktopWidth}
                desktopCenterItem={true}
                onChange={newValue =>
                    eventEmitter.emit(PAGE_INPUT_CHANGE_EVENT, {
                        block,
                        newValue: newValue,
                    })
                }
            />;
        case 'datepickerios':
            return <DatePickerIos
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                desktopWidth={desktopWidth}
                desktopCenterItem={true}
                onChange={newValue =>
                    eventEmitter.emit(PAGE_INPUT_CHANGE_EVENT, {
                        block,
                        newValue: newValue,
                    })
                }
            />;
        case 'divider':
            return <Divider
                key={key}
                desktopWidth={desktopWidth}
                desktopCenterItem={true}
                attrs={computedAttrs} />;
        case 'file':
            return <File
                key={key}
                value={computedValue}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'googlemap':
            return <GoogleMap
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'heading1':
            return <Heading
                key={key}
                value={computedValue}
                pageProps={pageProps}
                item={item}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'heading2':
            return <Heading
                key={key}
                value={computedValue}
                depth={2}
                pageProps={pageProps}
                item={item}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'heading3':
            return <Heading
                key={key}
                value={computedValue}
                depth={3}
                pageProps={pageProps}
                item={item}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'heading4':
            return <Heading
                key={key}
                value={computedValue}
                depth={4}
                pageProps={pageProps}
                item={item}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'heading5':
            return <Heading
                key={key}
                value={computedValue}
                depth={5}
                pageProps={pageProps}
                item={item}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'heading6':
            return <Heading
                key={key}
                value={computedValue}
                depth={6}
                pageProps={pageProps}
                item={item}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'image':
            return <Image
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                pageProps={pageProps}
                item={item}
                desktopWidth={desktopWidth}
                desktopCenterItem={true}
                onClick={(action) => {
                    eventEmitter.emit(PAGE_ACTION_CLICK_EVENT, { action, item })
                }} />;
        case 'input':
            return <Input
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                desktopWidth={desktopWidth}
                desktopCenterItem={true}
                onChange={newValue =>
                    eventEmitter.emit(PAGE_INPUT_CHANGE_EVENT, {
                        block,
                        newValue,
                    })
                }/>;
        case 'link':
            return <Link
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                onPress={() => eventEmitter.emit(PAGE_LINK_CLICK_EVENT, block, computedAttrs)}
                desktopWidth={desktopWidth}
                desktopCenterItem={true}/>;
        case 'multiselect':
            return <MultiSelect
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                desktopWidth={desktopWidth}
                desktopCenterItem={true}
                onChange={newValue =>
                    eventEmitter.emit(PAGE_INPUT_CHANGE_EVENT, {
                        block,
                        newValue: newValue,
                    })
                }
            />;
        case 'numberedlist':
            return <NumberedList
                key={key}
                values={computedValue}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'qr':
            return <QR
                key={key}
                value={computedValue}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'quote':
            return <Quote
                key={key}
                value={computedValue}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'singleselect':
            return <SingleSelect
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                desktopWidth={desktopWidth}
                desktopCenterItem={true}
                onChange={newValue =>
                    eventEmitter.emit(PAGE_INPUT_CHANGE_EVENT, {
                        block,
                        newValue: newValue,
                    })
                }
            />;
        case 'dropdown':
            return <Dropdown
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                desktopWidth={desktopWidth}
                desktopCenterItem={true}
                onChange={newValue =>
                    eventEmitter.emit(PAGE_INPUT_CHANGE_EVENT, {
                        block,
                        newValue: newValue,
                    })
                }
            />;
        case 'spacer':
            return <Spacer
                key={key}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'switch':
            return <Switch
                key={key}
                value={!!computedValue}
                attrs={computedAttrs}
                desktopWidth={desktopWidth}
                desktopCenterItem={true}
                onChange={newValue => {
                    eventEmitter.emit(PAGE_INPUT_CHANGE_EVENT, {
                        block,
                        newValue: newValue,
                    })}
                }
            />;
        case 'text':
            return <Text
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                pageProps={pageProps}
                item={item}
                desktopWidth={desktopWidth}
                desktopCenterItem={true}
                onInlineLinkClick={(url) => {
                    eventEmitter.emit(PAGE_INLINE_LINK_CLICK_EVENT, { url });
                }}
            />;
        case 'typeform':
            return <Typeform
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        case 'userpicker':
            return <UserPicker
                key={key}
                value={computedValue}
                attrs={computedAttrs}
                desktopWidth={desktopWidth}
                desktopCenterItem={true} />;
        default:
            return <Item key={key} />;
    }
}

export default PageRendererLocal;
