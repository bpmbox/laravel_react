import { shallow } from 'enzyme';
import React from 'react';
import sinon, { SinonSandbox } from 'sinon';
import getTranslate from '.';
import i18n from '../../i18n';

describe('getTranslate', (): void => {
    describe('T', () => {
        it('should return Trans component with namespace', (): void => {
            const { T } = getTranslate('jabberwonky');
            const wrapper = shallow(<T>hello</T>);

            const transComponent = wrapper.find('Trans');
            expect((transComponent.props() as { ns: string }).ns).toEqual('jabberwonky');
        });

        it('should allow namespace overrides', (): void => {
            const { T } = getTranslate('jabberwonky');
            const wrapper = shallow(<T ns="foobar">hello</T>);

            const transComponent = wrapper.find('Trans');
            expect((transComponent.props() as { ns: string }).ns).toEqual('foobar');
        });
    });
    describe('t', (): void => {
        let sandbox: SinonSandbox;
        beforeEach((): void => {
            sandbox = sinon.createSandbox();
            jest.resetModules();
        });

        afterEach((): void => {
            sandbox.restore();
        });

        it('should return Trans component with namespace', (): void => {
            const tSpy = sandbox.spy(i18n, 't');
            const { t } = getTranslate('jabberwonky');
            expect(t('Project Jabberwonky {{purpose}}', { purpose: 'will change everything' })).toBe(
                'Project Jabberwonky will change everything'
            );
            expect(tSpy.calledWith('jabberwonky::Project Jabberwonky {{purpose}}', sinon.match.object)).toBeTruthy();
        });

        it('should allow namespace overrides', (): void => {
            const tSpy = sandbox.spy(i18n, 't');
            const { t } = getTranslate('jabberwonky');
            expect(t('jabberwacky::Project Jabberwonky {{purpose}}', { purpose: 'will change everything' })).toBe(
                'Project Jabberwonky will change everything'
            );
            expect(tSpy.calledWith('jabberwacky::Project Jabberwonky {{purpose}}', sinon.match.object)).toBeTruthy();
        });
    });
});
