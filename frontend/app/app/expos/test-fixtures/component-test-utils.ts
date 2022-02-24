/* istanbul ignore file */
import { SinonFakeTimers, SinonSandbox } from 'sinon';
import { act } from 'react-dom/test-utils';
import alertService from '../services/alert';

export async function awaitPromises(clock: SinonFakeTimers | null = null, waitTime: number = 50) {
    // Run an act cycle to prevent logging warnings.
    act(() => {});

    await new Promise(resolve => {
        // Note: this shows as a squiggly warning in VSCode, however passes.  'setImmediate' is a global provided by NodeJS
        setImmediate(() => {
            resolve();
        });

        // If we are using a fake timer, we must advance the clock for promises to resolve.
        // Note: this is done after the setImmediate so the act of doing this will trigger the above promise.
        if (clock) {
            clock.tick(waitTime);
        }
    });
}

export function mockAlert(sandbox: SinonSandbox) {
    const alertStub = sandbox.stub(alertService, 'alert');

    const confirmAlert = () => {
        const handlerFunc = alertStub.lastCall.args[2][1].onPress as CallableFunction;
        handlerFunc();
    };

    return {
        alertStub,
        confirmAlert,
    };
}
