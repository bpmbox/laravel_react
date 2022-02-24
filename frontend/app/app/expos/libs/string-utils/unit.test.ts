import { SinonSandbox } from 'sinon';
import sinon from 'sinon';
import { capitalize, uncapitalize } from '.';

describe('capitalize', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should capitalize a string', () => {
        expect(capitalize('hello')).toBe('Hello');
    });

    it('should capitalize a sentence', () => {
        expect(capitalize('hello there')).toBe('Hello there');
    });

    it('should keep uncapitalized string', () => {
        expect(uncapitalize('hELLO')).toBe('hELLO');
    });

    it('should uncapitalize a string', () => {
        expect(uncapitalize('Hello')).toBe('hello');
    });

    it('should uncapitalize a sentence', () => {
        expect(uncapitalize('Hello There')).toBe('hello There');
    });
});
