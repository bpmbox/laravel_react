import React from 'react';
import sinon, { SinonSandbox } from 'sinon';
import { SpaceContext } from '../../SpaceContext';
import AuthStore from '../../../../store/auth';
import TestRenderer, { act } from 'react-test-renderer';
import { sampleUser, sampleSpace } from '../../../../test-fixtures/object-mother';
import SettingsPage from './SettingsPage';
import { Role } from '../../../../types/enums';

describe('SettingsPage', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('Updated button should not be enabled when slug is blank', async () => {
        // Test Setup
        const fakeNav = {
            navigate: sandbox.stub(),
        };

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider
                initialState={
                    {
                        isAuthenticated: true,
                        isLoading: false,
                        currentUser: sampleUser,
                    } as any
                }>
                <SpaceContext.Provider
                    value={{
                        space: sampleSpace,
                        role: Role.OWNER,
                    }}>
                    <SettingsPage navigation={fakeNav} />
                </SpaceContext.Provider>
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Assert initial conditions, update button should be disabled.
        const updateButton = testRenderer.root.findByProps({ testID: 'UpdateButton' });
        expect(updateButton.props.disabled).toBeTruthy();

        // Set a valid value, so update button becomes enabled.
        const urlInput = testRenderer.root.findByProps({ testID: 'SpaceUrlInput' });
        await act(async () => {
            urlInput.props.onChangeText({ target: { value: 'newspaceurl' } });
            await new Promise(setImmediate);
        });
        expect(updateButton.props.disabled).toBeFalsy();

        // Set a invalid value, so update button becomes disabled.
        await act(async () => {
            urlInput.props.onChangeText({ target: { value: '' } });
            await new Promise(setImmediate);
        });
        expect(updateButton.props.disabled).toBeTruthy();
    });
});
