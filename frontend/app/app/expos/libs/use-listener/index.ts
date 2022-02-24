import { useEffect, useRef, useCallback } from 'react';

/**
 * Registers an event listener within a useEffect hook to facilitate
 * automatic cleanup.
 *
 * Usage:
 *      useListener(spaceService, SPACES_UPDATED_EVENT, handleSpaceChange);
 *
 * @param emitter
 * @param event
 * @param listener
 */
export default function useListener(
    emitter: EventEmitter,
    event: string,
    listener: CallableFunction
): void {
    const handler = useRef<CallableFunction>();

    // Wrap the handler in useCallback() to only update when the listner
    // function updates.
    const wrappedHandler = useCallback(
        (...args) => {
            return listener(...args);
        },
        [listener]
    );

    // Keep a ref referring to the most current version of the handler.
    useEffect(() => {
        handler.current = wrappedHandler;
    }, [wrappedHandler]);

    useEffect(() => {
        // Keep the handler function within this useEffect block so it stays constant,
        // however it refers to the wrappedHandler which is dynamic and will stay up
        // to date via the useRef.
        const registeredListener = (...args) => {
            handler.current(...args);
        };
        emitter.addListener(event, registeredListener);

        return () => {
            emitter.removeListener(event, registeredListener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
