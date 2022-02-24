import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import sinon, { SinonSandbox } from 'sinon';
import { PARAM_INVITATION, PARAM_USER } from '../../../../constants';
import spaceService from '../../../../services/space';
import AuthStore from '../../../../store/auth';
import { mockAlert } from '../../../../test-fixtures/component-test-utils';
import { sampleSpace, sampleUser } from '../../../../test-fixtures/object-mother';
import { Role } from '../../../../types/enums';
import { SpaceContext } from '../../SpaceContext';
import ChangeRolePage from './ChangeRolePage';

describe('ChangeRolePage', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should resend invitation', async () => {
        const getParam = sandbox.stub();
        const invitation: Invitation = {
            email: 'jsnow@winterfell.com',
            role: Role.ADMIN,
            groupIds: [],
            message: null,
            user: null,
        };

        getParam.withArgs(PARAM_INVITATION).returns(invitation);
        getParam.withArgs(PARAM_USER).returns(null);

        const resendInvitation = sandbox.stub(spaceService, 'resendInvitation');

        // Test Setup
        const fakeNav = {
            navigate: sandbox.stub(),
            getParam,
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
                    <ChangeRolePage navigation={fakeNav as any} space={sampleSpace} />
                </SpaceContext.Provider>
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Assert precondition, button should exist.
        const resendButton = testRenderer.root.findByProps({
            testID: 'ResendButton',
        });
        expect(resendButton).toBeTruthy();

        // Perform action
        await act(async () => {
            resendButton.props.onPress();
            await new Promise(setImmediate);
        });
        // One last await to allow post submit actions to resolve.
        await act(async () => {
            await new Promise(setImmediate);
        });

        // Verify action is preformed.
        expect(resendInvitation.called).toBeTruthy();
    });

    it('should remove invitation', async () => {
        const getParam = sandbox.stub();
        const invitation: Invitation = {
            email: 'jsnow@winterfell.com',
            role: Role.ADMIN,
            groupIds: [],
            message: null,
            user: null,
        };

        getParam.withArgs(PARAM_INVITATION).returns(invitation);
        getParam.withArgs(PARAM_USER).returns(null);

        const { confirmAlert } = mockAlert(sandbox);
        const cancelInvitation = sandbox.stub(spaceService, 'cancelInvitation');

        // Test Setup
        const fakeNav = {
            navigate: sandbox.stub(),
            getParam,
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
                    <ChangeRolePage navigation={fakeNav as any} space={sampleSpace} />
                </SpaceContext.Provider>
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Assert precondition, button should exist.
        const removeButton = testRenderer.root.findByProps({
            testID: 'RemoveButton',
        });
        expect(removeButton).toBeTruthy();

        // Perform action
        // Click remove button
        await act(async () => {
            removeButton.props.onPress();
            await new Promise(setImmediate);
        });
        // One last await to allow post submit actions to resolve.
        await act(async () => {
            await new Promise(setImmediate);
        });
        // Simulate Alert confirm.
        await act(async () => {
            confirmAlert();
            await new Promise(setImmediate);
        });

        // Verify action is preformed.
        expect(cancelInvitation.called).toBeTruthy();
    });

    it('should update role on invitation', async () => {
        const getParam = sandbox.stub();
        const invitation: Invitation = {
            email: 'jsnow@winterfell.com',
            role: Role.ADMIN,
            groupIds: [],
            message: null,
            user: null,
        };

        getParam.withArgs(PARAM_INVITATION).returns(invitation);
        getParam.withArgs(PARAM_USER).returns(null);
        
        const updateInvitation = sandbox.stub(spaceService, 'updateInvitation');

        // Test Setup
        const fakeNav = {
            navigate: sandbox.stub(),
            getParam,
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
                    <ChangeRolePage navigation={fakeNav as any} space={sampleSpace} />
                </SpaceContext.Provider>
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Assert precondition, button should exist.
        const roleSelectButtons = testRenderer.root.findAllByProps({
            testID: 'RoleSelectItem',
        });
        expect(roleSelectButtons[0].props['title']).toBe('Guest');

        // Perform action
        // Select the guest role.
        await act(async () => {
            roleSelectButtons[0].props['onPress']();
            await new Promise(setImmediate);
        });
        // One last await to allow post submit actions to resolve.
        await act(async () => {
            await new Promise(setImmediate);
        });

        // Verify action is preformed.
        console.log(updateInvitation.args);
        expect(updateInvitation.args[0][1]['role']).toBe(Role.GUEST);
    });
});
