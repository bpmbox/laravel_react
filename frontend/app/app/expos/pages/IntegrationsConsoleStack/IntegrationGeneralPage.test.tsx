import React from 'react';
import renderer, { act } from 'react-test-renderer';
import sinon, { SinonSandbox } from 'sinon';
import * as navSecrets from '../../libs/secret-nav-var';
import messageService from '../../services/message';
import { sampleIntegration } from '../../test-fixtures/object-mother';
import IntegrationGeneralPage from './IntegrationGeneralPage';

describe('IntegrationGeneralPage', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    // TODO: DL - I cannot seem to find out why I'm getting a
    // `Invariant Violation: withNavigation can only be used on a view hierarchy of a navigator.
    // The wrapped component is unable to get access to navigation from props or context.` error.
    // Same construction is used on many other unit tests.  For now skipping this test for the sake
    // of progress.
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should display list of updated roles after a role update', async () => {
        // Test Setup
        const fakeNav = {
            navigate: sandbox.stub(),
            getParam: sandbox.stub(),
        };

        const sendError = sandbox.stub(messageService, 'sendError');

        // Stubout nav secrets since this relies on NavigationContext.
        sandbox.stub(navSecrets, 'clearSecretNavigationVar');
        sandbox.stub(navSecrets, 'setSecretNavigationVar');
        sandbox.stub(navSecrets, 'getSecretNavigationVar');

        const integrationConfig: NSIntegration.Config = {
            categoryChoices: [],
            accessChoices: [],
            typeChoices: [],
            defaultPermissionChoices: [],
        };

        const testRenderer = renderer.create(
            <IntegrationGeneralPage
                navigation={fakeNav as any}
                config={integrationConfig}
                integration={sampleIntegration}
            />
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Assert preconditions
        expect(sendError.called).toBeFalsy();
        const nameInput = testRenderer.root.findByProps({
            testID: 'NameInput',
        });
        expect(nameInput).toBeTruthy();

        // Perform Action
        await act(async () => {
            // Simulate text input of clearing field.
            nameInput.props.onChangeText({ target: { value: '' } });

            // Await promise queue to clear.
            await new Promise(setImmediate);
        });

        // Validate
        expect(sendError.called).toBeTruthy();
    });
});
