import React from 'react';
import SpaceRedirect from './SpaceRedirect';
import { SinonSandbox } from 'sinon';
import sinon from 'sinon';
import historyService from '../services/history';
import { sampleUser, sampleSpace } from '../test-fixtures/object-mother';
import AuthStore from '../store/auth';
import spaceService from '../services/space';
import trackingService from '../services/tracking';
import TestRenderer, { act } from 'react-test-renderer';
import routes from '../routes';
import { Role } from '../types/enums';
import { PARAM_SLUG } from '../constants';

describe('CreateJoinSpacePage', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should redirect to Space selector when logging in with no spaces joined.', async () => {
        const fakeNav = {
            getParam: sandbox.stub(),
        };

        const navAsRoot = sandbox.stub(historyService, 'navigateAsRoot');

        sandbox.stub(spaceService, 'getSpaces').resolves([]);
        sandbox.stub(trackingService, 'getLastVisitedSpace').resolves(null);

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider
                initialState={
                    {
                        isAuthenticated: true,
                        isLoading: false,
                        currentUser: sampleUser,
                    } as any
                }>
                <SpaceRedirect navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // resolve pending promises.
        await act(async () => {
            await new Promise(setImmediate);
        });

        expect(testRenderer.root).toBeDefined(); // Check to make sure this component at least renders.

        // Check our expected redirect to Join Space page happens.
        expect(navAsRoot.calledWith(routes.ONBOARDING_SPACE)).toBeTruthy();
    });

    it('should redirect to updated space info when last visited space is outdated.', async () => {
        const fakeNav = {
            getParam: sandbox.stub(),
        };

        const navAsRoot = sandbox.stub(historyService, 'navigateAsRoot');

        const outDatedSpace = Object.assign({}, sampleSpace, { slug: 'outdated' });
        const updatedSpace = Object.assign({}, sampleSpace, { slug: 'new' });

        sandbox.stub(spaceService, 'getSpaces').resolves([]);
        sandbox.stub(trackingService, 'getLastVisitedSpace').resolves(outDatedSpace);
        sandbox.stub(spaceService, 'getInfoById').resolves({
            space: updatedSpace,
            role: Role.MEMBER,
            chat: {
                userId: '123',
                accessToken: 'abc',
            },
            invited: false,
        });

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider
                initialState={
                    {
                        isAuthenticated: true,
                        isLoading: false,
                        currentUser: sampleUser,
                    } as any
                }>
                <SpaceRedirect navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // resolve pending promises.
        await act(async () => {
            await new Promise(setImmediate);
        });

        expect(testRenderer.root).toBeDefined(); // Check to make sure this component at least renders.

        // Check our expected redirect to Join Space page happens.
        expect(
            navAsRoot.alwaysCalledWith(routes.MAIN, {
                [PARAM_SLUG]: updatedSpace.slug,
            })
        ).toBeTruthy();
    });
});
