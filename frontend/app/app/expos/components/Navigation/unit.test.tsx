import renderer from 'react-test-renderer';
import React from 'react';
import {NavHeaderSpaceSwitcher} from './NavButtons';
import sinon, {SinonSandbox} from 'sinon';


describe('Navigation', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('renders NavHeaderSpaceSwitcher without crash', () => {
        const fakeNav = {
            getParam: sandbox.stub(),
        };

        const tree = renderer.create(<NavHeaderSpaceSwitcher navigation={fakeNav}/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

});

