import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import sinon, { SinonSandbox } from 'sinon';
import SettingsMobileMainPage from './SettingsMobileMainPage';

describe('SettingsMobileMainPage', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should render and display navigation menu.', async () => {
        // Test Setup
        const fakeNav = {
            navigate: sandbox.stub(),
        };

        const testRenderer = TestRenderer.create(<SettingsMobileMainPage navigation={fakeNav} />);
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Assert a few expected elements
        expect(testRenderer.root.findByProps({ testID: 'AccountsMenuItem' })).toBeTruthy();        
    });
});
