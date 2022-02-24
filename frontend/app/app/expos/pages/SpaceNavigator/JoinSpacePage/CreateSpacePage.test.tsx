import { act } from '@testing-library/react-hooks';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import sinon, { SinonSandbox } from 'sinon';
import { PARAM_SPACE } from '../../../constants';
import routes from '../../../routes';
import spaceService from '../../../services/space';
import AuthStore from '../../../store/auth';
import { sampleSpace } from '../../../test-fixtures/object-mother';
import CreateSpacePage from './CreateSpacePage';

describe('CreateSpacePage', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should call service create page then redirect on success', async () => {
        const fakeNav = {
            navigate: sandbox.stub(),
        };

        const createSpace = sandbox
            .stub(spaceService, 'createSpace')
            .resolves(sampleSpace);
        sandbox.stub(spaceService, 'checkSlugNotTaken').resolves(true);

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider
                initialState={
                    { isAuthenticated: true, isLoading: false } as any
                }>
                <CreateSpacePage navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Snapshot test to check preconditions that page rendered correctly.
        expect(testRenderer.toJSON()).toMatchSnapshot();

        // Perform action of filling out the form.
        await act(async () => {
            const spaceNameInput = testRenderer.root.findByProps({
                testID: 'SpaceNameInput',
            });
            spaceNameInput.props.onChangeText({
                persist: (): void => {},
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
                persist: (): void => {},
                target: {
                    name: 'spaceName',
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
        // One last await to allow post submit actions to resolve.
        await act(async () => {
            await new Promise(setImmediate);
        });

        // Verify expected actions happen.
        expect(createSpace.calledWith('Winterfell', 'winterfell')).toBeTruthy();
        expect(
            fakeNav.navigate.calledWith(routes.MAIN_SPACE_REDIRECT, {
                [PARAM_SPACE]: sampleSpace,
                key: sampleSpace.slug,
            })
        ).toBeTruthy();
    });
});
