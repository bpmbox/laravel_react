import { renderHook } from '@testing-library/react-hooks';
import sinon, { SinonSandbox } from 'sinon';
import { useAlertStore } from '.';
import alertService from '../../services/alert';

describe('MsgStore', (): void => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('it should set current title', async (): Promise<void> => {
        let listener: Function | null = null;
        sandbox.stub(alertService, 'addListener').callsFake((_evt, evtListener): any => {
            listener = evtListener;
        });
        const { result, rerender } = renderHook(() => useAlertStore());

        // Await end of proise queue to allow useEffect() to complete
        await new Promise(resolve => {
            setImmediate(() => resolve());
        });

        if (!listener) {
            return fail('listener not set');
        }

        (listener as (m: AlertServiceTypes.IAlertEventPayload) => void)({
            title: 'Error',
            description: 'This is an error',
            buttons: [],
        });
        rerender();
        expect(result.current.currentAlert).toMatchObject({
            title: 'Error',
            description: 'This is an error',
            buttons: [],
        });
    });
});
