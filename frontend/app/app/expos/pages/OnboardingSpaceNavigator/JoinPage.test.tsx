import { act } from '@testing-library/react-hooks';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import sinon, { SinonSandbox } from 'sinon';
import spaceService from '../../services/space';
import AuthStore from '../../store/auth';
import { PARAM_SPACE } from '../../constants';
import routes from '../../routes';
import JoinPage from './JoinPage';
import { sampleSpace } from '../../test-fixtures/object-mother';

describe('JoinPage', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should join space and redirect to it', async () => {
        const fakeNavigation = {
            navigate: jest.fn(),
        };

        sandbox.stub(spaceService, 'getInvitedSpaces').resolves([sampleSpace])
        const joinSpace = sandbox.stub(spaceService, 'joinSpace').resolves();

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
                <JoinPage navigation={fakeNavigation} />
            </AuthStore.Provider>
        );
        // Await initial render
        await act(async () => {
            await new Promise(setImmediate);
        });
        // Using snapshot to assert preconditions.
        expect(testRenderer.toJSON()).toMatchSnapshot();

        // Select a space to join.
        await act(async () => {
            const selectSpace = testRenderer.root.findByProps({
                testID: `SelectSpace_${sampleSpace.id}`,
            });
            selectSpace.props.onPress();            
            await new Promise(setImmediate);
        });

        await act(async () => {
            await new Promise(setImmediate);
        });

        // Assert expected results.
        // expect(joinSpace.calledOnce).toBeTruthy();
        // expect(joinSpace.calledWith(sampleSpace)).toBeTruthy();
        // assert redirect occurrs.
        expect(fakeNavigation.navigate).toBeCalledWith(
            routes.ONBOARDING_SPACE_INTRO, {
            [PARAM_SPACE]: sampleSpace,
        });
    });
});