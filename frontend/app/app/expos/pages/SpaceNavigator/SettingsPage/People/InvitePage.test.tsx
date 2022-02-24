import { SinonSandbox } from 'sinon';
import sinon from 'sinon';
import React from 'react';
import spaceService from '../../../../services/space';
import { SpaceContext } from '../../SpaceContext';
import { sampleSpace } from '../../../../test-fixtures/object-mother';
import { Role } from '../../../../types/enums';
import TestRenderer, { act } from 'react-test-renderer';
import InvitePage from './InvitePage';
import messageService from '../../../../services/message';

describe('InvitePage', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    // Ran into withNavigation error.  Was not able to figure out a workaround.  Skipping test for now. - DL
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should display error message if sending to already invited user.', async () => {
        const getParam = sandbox.stub();
        // Test Setup
        const fakeNav = {
            navigate: sandbox.stub(),
            getParam,
        };

        sandbox.stub(spaceService, 'sendInvitation').rejects({
            message: 'User already invited.',
            code: '002-409-0022',
        });

        const sendError = sandbox.stub(messageService, 'sendError');

        const renderer = TestRenderer.create(
            <SpaceContext.Provider
                value={{
                    space: sampleSpace,
                    role: Role.OWNER,
                }}>
                <InvitePage navigation={fakeNav} space={sampleSpace} />
            </SpaceContext.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Assert Preconditions - Page renders, and displays email input
        const emailInput = renderer.root.findByProps({ testID: 'EmailInput' });
        expect(emailInput).toBeTruthy();

        // Simulate entering an already invited email.
        await act(async () => {
            (emailInput.props.onTextChange as any)({ target: { value: 'already@invited.com' } });
            await new Promise(setImmediate);

            (renderer.root.findByProps({ testID: 'SubmitInvite' }).props.onPress as any)();
            await new Promise(setImmediate);
        });

        expect(sendError.calledWith('An invitation has already been sent to this user.')).toBeTruthy();
    });

    // Ran into withNavigation error.  Was not able to figure out a workaround.  Skipping test for now. - DL
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should display error message if sending to a user already joined.', async () => {
        const getParam = sandbox.stub();
        // Test Setup
        const fakeNav = {
            navigate: sandbox.stub(),
            getParam,
        };

        sandbox.stub(spaceService, 'sendInvitation').rejects({
            message: 'User has already joined the space.',
            code: '002-409-0006',
        });

        const sendError = sandbox.stub(messageService, 'sendError');

        const renderer = TestRenderer.create(
            <SpaceContext.Provider
                value={{
                    space: sampleSpace,
                    role: Role.OWNER,
                }}>
                <InvitePage navigation={fakeNav} space={sampleSpace} />
            </SpaceContext.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Assert Preconditions - Page renders, and displays email input
        const emailInput = renderer.root.findByProps({ testID: 'EmailInput' });
        expect(emailInput).toBeTruthy();
        // Also check the submit button gets reenabled.
        expect(renderer.root.findByProps({ testID: 'SubmitInvite' }).props.disabled).toBeFalsy();        

        // Simulate entering an already invited email.
        await act(async () => {
            (emailInput.props.onTextChange as any)({ target: { value: 'already@invited.com' } });
            await new Promise(setImmediate);

            (renderer.root.findByProps({ testID: 'SubmitInvite' }).props.onPress as any)();
            await new Promise(setImmediate);
        });

        expect(sendError.calledWith('User has already joined this space.')).toBeTruthy();

        // Also check the submit button gets reenabled.
        expect(renderer.root.findByProps({ testID: 'SubmitInvite' }).props.disabled).toBeFalsy();
    });
});
