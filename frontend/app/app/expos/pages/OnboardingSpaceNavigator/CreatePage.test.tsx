import { act } from '@testing-library/react-hooks';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import sinon, { SinonSandbox } from 'sinon';
import { PARAM_SPACE } from '../../constants';
import routes from '../../routes';
import spaceService from '../../services/space';
import AuthStore from '../../store/auth';
import CreatePage from './CreatePage';

describe('CreatePage', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should create space and redirect to it', async () => {
        const fakeNavigation = {
            navigate: jest.fn(),
        };

        const createSpace = sandbox.stub(spaceService, 'createSpace').resolves({
            id: 'space1',
            name: 'Winterfell',
            slug: 'winterfell',
            iconUrl: null,
        });

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider
                initialState={
                    {
                        isAuthenticated: true,
                        isLoading: false,
                        currentUser: {
                            id: 'abc',
                            givenName: 'Jon',
                            familyName: 'Snow',
                            email: 'jonsnow@winterfell.com',
                            avatarUrl: null,
                        },
                    } as any
                }>
                <CreatePage navigation={fakeNavigation} />
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
            const spaceNameInput = testRenderer.root.findByProps({
                testID: 'SpaceNameInput',
            });
            spaceNameInput.props.onChangeText({
                persist: (): void => { },
                target: {
                    name: 'spaceName',
                    value: 'Winterfell',
                },
            });
            spaceNameInput.props.onBlur();
            await new Promise(setImmediate);
        });

        await act(async () => {
            const spaceUrlInput = testRenderer.root.findByProps({
                testID: 'SpaceUrlInput',
            });
            spaceUrlInput.props.onChangeText({
                persist: (): void => { },
                target: {
                    name: 'spaceUrl',
                    value: 'winterfell',
                },
            });
            spaceUrlInput.props.onBlur();
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
        expect(createSpace.calledOnce).toBeTruthy();
        expect(createSpace.calledWith('Winterfell', 'winterfell')).toBeTruthy();
        // assert redirect occurrs.
        expect(fakeNavigation.navigate).toBeCalledWith(
            routes.MAIN_SPACE_REDIRECT, {
            [PARAM_SPACE]: {
                iconUrl: null,
                id: 'space1',
                name: 'Winterfell',
                slug: 'winterfell',
            }
        });
    });
});