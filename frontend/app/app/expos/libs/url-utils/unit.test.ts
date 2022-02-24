import { SinonSandbox } from 'sinon';
import sinon from 'sinon';
import { getURLQueryParams, getURLScheme } from '.';

const TEST_URL = 'withtree://?pageId=1&integrationId=2';

describe('url-utils', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should get URL scheme', () => {
        expect(getURLScheme(TEST_URL)).toBe('withtree');
    });

    it('should get first query param', () => {
        expect(getURLQueryParams(TEST_URL)['pageId']).toBe('1');
    });

    it('should get second query param', () => {
        expect(getURLQueryParams(TEST_URL)['integrationId']).toBe('2');
    });
});
