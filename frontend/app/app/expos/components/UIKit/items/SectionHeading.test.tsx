import { act, render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import { ItemWidth } from '../../../theme.style';
import SectionHeading from './SectionHeading';
import SingleLineInput from './SingleLineInput';

describe('items.SectionHeading', () => {
    it('DesktopWidth and Desktop Centered Item Props should be supported', async () => {
        const tree = render(
            <View>
                <SectionHeading
                    testID="header"
                    text="First:"
                    desktopWidth={ItemWidth.narrow}
                    desktopCenterItem={true}
                />
                <SingleLineInput
                    testID="input"
                    placeholder="First name"
                    desktopWidth={ItemWidth.narrow}
                    desktopCenterItem={true}
                />
            </View>
        );
        await act(() => new Promise(setImmediate));

        // React renderer does not render on a real canvas, so we cannot verify item width and positions.
        // For now we'll just check that it renders child elements and that it matches a snapshot.
        const header = tree.getAllByText('First:')[0];
        const input = tree.getAllByPlaceholderText('First name')[0];
        expect(header).toBeTruthy();
        expect(input).toBeTruthy();

        expect(tree.asJSON()).toMatchSnapshot();
    });
});
