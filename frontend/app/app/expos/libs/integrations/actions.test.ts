import { getEvaluatedPayload } from './actions';
import sinon, { SinonSandbox } from 'sinon';

describe('Actions', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();

        sandbox.useFakeTimers();
        const today = new Date('2019-12-07 12:00:00');
        sandbox.clock.setSystemTime(today);
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should confirm that tomorrow is later than today', () => {
        const payload = {
            'value': 'Result: ${1+2}'
        }
        expect(getEvaluatedPayload(payload, 'value', null, null, null, null)).toBe('Result: 3');
    });
});
