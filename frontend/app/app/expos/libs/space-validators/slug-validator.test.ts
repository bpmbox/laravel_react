import { act, renderHook } from '@testing-library/react-hooks';
import sinon, { SinonSandbox } from 'sinon';
import messageService from '../../services/message';
import spaceService from '../../services/space';
import useSpaceSlugValidator from './slug-validator';

describe('SpaceValidators.useSpaceSlugValidator', () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should notify if typed slug is already taken.', async (): Promise<void> => {
        sandbox.useFakeTimers();
        sandbox.stub(spaceService, 'checkSlugNotTaken').resolves(false);
        const sendError = sandbox.spy(messageService, 'sendWarning');

        const { result } = renderHook(() => useSpaceSlugValidator());

        // simulate typing by calling it with 1 added letter at a time.
        act(() => {
            result.current.validateSlug('f');
            result.current.validateSlug('fo');
            result.current.validateSlug('foo');
            sandbox.clock.tick(2000); //Above method is debounced, advance the clock.
        });

        //await promise queue to resolve.
        await new Promise(resolve => {
            setImmediate(() => {
                resolve();
            });
            sandbox.clock.tick(1); // To advance to next ticket so above resolves.
        });

        expect(sendError.calledOnce).toBeTruthy();        
    });

    it('should not notify if typed slug is not taken.', async (): Promise<void> => {
        sandbox.useFakeTimers();
        sandbox.stub(spaceService, 'checkSlugNotTaken').resolves(true);
        const sendError = sandbox.spy(messageService, 'sendWarning');

        const { result } = renderHook(() => useSpaceSlugValidator());

        // simulate typing by calling it with 1 added letter at a time.
        act(() => {
            result.current.validateSlug('f');
            result.current.validateSlug('fo');
            result.current.validateSlug('foo');
            sandbox.clock.tick(2000); //Above method is debounced, advance the clock.
        });

        //await promise queue to resolve.
        await new Promise(resolve => {
            setImmediate(() => {
                resolve();
            });
            sandbox.clock.tick(1); // To advance to next ticket so above resolves.
        });

        expect(sendError.calledOnce).toBeFalsy();
    });
});
