import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import { PageContent } from '../../libs/integration/pageRenderer';
import TestPage from '../../pages/Integration/TestPage';

const USER_PICKER_DATA = {
    value: {
        users: [
            {
                id: '8b1a9953c4611296a827abf8c47804d6',
                givenName: 'Marty',
                familyName: 'Stepper',
                email: 'mstepper@email.com',
                avatarUrl: 'https://www.iconninja.com/files/830/684/873/avatar-user-woman-girl-female-person-icon.png',
            },
            {
                id: '8b1a9953c4611296a827abf8c47804d7',
                givenName: 'Joan',
                familyName: 'Parker',
                email: 'jparker@yahoo.com',
                avatarUrl: 'https://www.iconninja.com/files/830/684/873/avatar-user-woman-girl-female-person-icon.png',
            },
            {
                id: '8b1a9953c4611296a827abf8c47804d8',
                givenName: 'Claude',
                familyName: 'VanDamme',
                email: 'jcvd@vandamme.org',
                avatarUrl: 'https://d1nhio0ox7pgb.cloudfront.net/_img/v_collection_png/128x128/shadow/businessman2.png',
            },
            {
                id: '8b1a9953c4611296a827abf8c47804d9',
                givenName: 'Marty',
                familyName: 'McFly',
                email: 'mmcfly@msn.com',
                avatarUrl:
                    'https://upload.wikimedia.org/wikipedia/en/thumb/d/d8/Michael_J._Fox_as_Marty_McFly_in_Back_to_the_Future%2C_1985.jpg/220px-Michael_J._Fox_as_Marty_McFly_in_Back_to_the_Future%2C_1985.jpg',
            },
        ],
        userGroups: [
            {
                id: '83218ac34c1834c26781fe4bde918ee4',
                name: 'Product Managers',
            },
            {
                id: '83218ac34c1834c26781fe4bde918ee5',
                name: 'Developers',
            },
            {
                id: '83218ac34c1834c26781fe4bde918ee6',
                name: 'Q/A',
            },
        ],
    },
    attrs: {
        label: 'Participants',
    },
};

it('renders empty page', () => {
    const content = {
        title: 'Test page',
        blocks: [],
    };

    const tree = renderer.create(<TestPage content={content} />).toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders page with quote block', () => {
    const content: PageContent = {
        title: 'Test page with quote',
        blocks: [{ type: 'quote', value: 'This is a quote' }],
    };

    const tree = renderer.create(<TestPage content={content} />).toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders page with User Picker block', () => {
    const content: PageContent = {
        title: 'Test page with quote',
        blocks: [
            {
                type: 'userpicker',
                ...USER_PICKER_DATA,
            },
        ],
    };

    const tree = renderer.create(<TestPage content={content} />).toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders page with gallery of components', () => {
    const listItems = [
        'Item 1',
        'Item 2',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi est sapien, gravida id nulla nec, sodales tristique metus. Sed euismod enim vel velit commodo, nec tristique mi tempus. Fusce aliquet quis erat non sollicitudin.',
    ];
    const listItems2 = [
        ...listItems,
        'Item 4',
        'Item 5',
        'Item 6',
        'Item 7',
        'Item 8',
        'Item 9',
        'Item 10',
        'Item 11',
        'Item 12',
    ];
    const jsMarkdownBlob = `\`\`\` js
// this is JS code in a Text block
var foo = function (bar) {
    return bar++;
};

console.log(foo(5));
\`\`\``;

    const content: PageContent = {
        title: 'Test gallery page',
        blocks: [
            { type: 'heading2', value: 'Input' },
            { type: 'input', value: 'Hello', attrs: { placeholder: 'Placeholder text...' } },
            { type: 'button', value: 'Submit', attrs: { action: 'submit' } },

            { type: 'heading1', value: 'Basic' },
            { type: 'heading2', value: 'Text' },
            {
                type: 'text',
                value:
                    'Plain text: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
            },
            { type: 'text', value: '**Text** *with* `inline code` and [links](https://withtree.com)' },

            { type: 'heading2', value: 'Links' },
            { type: 'link', value: 'This is a link', attrs: { pageId: '123456' } },

            { type: 'heading2', value: 'Callout' },
            {
                type: 'callout',
                value:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
            },
            { type: 'callout', value: 'Success', attrs: { type: 'success' } },
            { type: 'callout', value: 'Warning', attrs: { type: 'warning' } },
            { type: 'callout', value: 'Error', attrs: { type: 'error' } },

            { type: 'heading2', value: 'Divider' },
            { type: 'divider' },

            { type: 'heading2', value: 'Quote' },
            { type: 'quote', value: 'Lorem ipsum dolor sit amet.' },
            {
                type: 'quote',
                value:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
            },

            { type: 'heading2', value: 'BulletedList' },
            { type: 'bulletedlist', value: listItems },

            { type: 'heading2', value: 'NumberedList' },
            { type: 'numberedlist', value: listItems2 },

            { type: 'heading2', value: 'Code' },
            {
                type: 'code',
                value: `const App = () => {
    const listItems = [
        "Item 1",
        "Item 2",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    ];
};
export default App;`,
                attrs: { lang: 'js' },
            },
            { type: 'text', value: jsMarkdownBlob },

            { type: 'heading2', value: 'Heading' },
            { type: 'heading1', value: 'Heading1 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed' },
            { type: 'heading2', value: 'Heading2 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed' },
            { type: 'heading3', value: 'Heading3 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed' },

            { type: 'heading1', value: 'Embed' },
            { type: 'heading2', value: 'File' },
            {
                type: 'file',
                value: 'http://web.stanford.edu/class/archive/cs/cs106b/cs106b.1198/lectures/Lecture2/Lecture2.pdf',
            },
            {
                type: 'file',
                value:
                    'https://d33wubrfki0l68.cloudfront.net/6d8aec4f2bd015cca1b4a170c57c1a93d16790d9/a88d5/static/images/external/articles/318d0a2b81afef4a5e27413e9cda3b0e@2x.jpg',
            },
            { type: 'file', value: 'http://homestarrunner.com/index.html' },

            { type: 'heading2', value: 'Image' },
            {
                type: 'image',
                value:
                    'https://d33wubrfki0l68.cloudfront.net/223dfe9f9d78da463ca4a2e46c41bbc18eea16b6/cfdba/static/images/external/articles/1d46669eac4f923d62473f669a0ae0fa@2x.jpg',
                attrs: { caption: 'ORIGINAL' },
            },
            {
                type: 'image',
                value:
                    'https://d33wubrfki0l68.cloudfront.net/59398e9d0568c9dfd45e605842bef35cc9695681/c8ceb/static/images/external/articles/d888770a5c275f477b696e61d799b608@2x.jpg',
                attrs: { caption: 'SQUARE Aviva Investors', format: 'square' },
            },
            {
                type: 'image',
                value:
                    'https://d33wubrfki0l68.cloudfront.net/4027100817123b98530af125f8a41cad03f45890/4ee35/static/images/external/articles/518d9d50544c6470675601c167124db3@2x.jpg',
                attrs: {
                    caption:
                        'LANDSCAPE The Tree House Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
                    format: 'landscape',
                },
            },
            {
                type: 'image',
                value:
                    'https://d33wubrfki0l68.cloudfront.net/59398e9d0568c9dfd45e605842bef35cc9695681/c8ceb/static/images/external/articles/d888770a5c275f477b696e61d799b608@2x.jpg',
                attrs: { caption: 'W/H Aviva Investors', width: 120, height: 50 },
            },
        ],
    };

    const tree = renderer.create(<TestPage content={content} />).toJSON();
    expect(tree).toMatchSnapshot();
});
