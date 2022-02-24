import { act } from '@testing-library/react-hooks';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import sinon, { SinonSandbox } from 'sinon';
import userService from '../../services/user';
import AuthStore from '../../store/auth';
import routes from '../../routes';
import EnterDetailsPage from './EnterDetailsPage';

describe('EnterDetailsPage', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should submit account details', async () => {
        const fakeNavigation = {
            navigate: jest.fn(),
        };

        const registerUser = sandbox.stub(userService, 'registerAccountUser').resolves();

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider
                initialState={
                    {
                        isAuthenticated: true,
                        isLoading: false,
                        currentUser: {
                            id: 'abc',
                            givenName: '',
                            familyName: '',
                            email: 'jonsnow@winterfell.com',
                            avatarUrl: null,
                        },
                    } as any
                }>
                <EnterDetailsPage navigation={fakeNavigation} />
            </AuthStore.Provider>
        );
        // Await initial render
        await act(async () => {
            await new Promise(setImmediate);
        });
        // Using snapshot to assert preconditions.
        expect(testRenderer.toJSON()).toMatchSnapshot();

        // Fill out form.
        await act(async () => {
            const givenNameInput = testRenderer.root.findByProps({
                testID: 'GivenNameInput',
            });
            givenNameInput.props.onChangeText({
                persist: (): void => { },
                target: {
                    name: 'givenName',
                    value: 'Jon',
                },
            });
            givenNameInput.props.onBlur();
            await new Promise(setImmediate);
        });

        await act(async () => {
            const familyNameInput = testRenderer.root.findByProps({
                testID: 'FamilyNameInput',
            });
            familyNameInput.props.onChangeText({
                persist: (): void => { },
                target: {
                    name: 'familyName',
                    value: 'Snow',
                },
            });
            familyNameInput.props.onBlur();
            await new Promise(setImmediate);
        });

        await act(async () => {
            const reasonSelect = testRenderer.root.findByProps({
                testID: 'ReasonSelection_personal',
            });
            reasonSelect.props.onPress();            
            await new Promise(setImmediate);
        });

        await act(async () => {
            const submitButton = testRenderer.root.findByProps({
                testID: 'SubmitButton',
            });
            submitButton.props.onPress();            
            await new Promise(setImmediate);
        });

        await act(async () => {
            await new Promise(setImmediate);
        });

        // Assert expected results.
        expect(registerUser.calledOnce).toBeTruthy();
        expect(registerUser.calledWith({
            givenName: 'Jon',
            familyName: 'Snow',
            purpose: 'personal',
            avatarUrl: null,
        })).toBeTruthy();
        // assert redirect occurrs.
        expect(fakeNavigation.navigate).toBeCalledWith(routes.ONBOARDING_SPACE);
    });
});