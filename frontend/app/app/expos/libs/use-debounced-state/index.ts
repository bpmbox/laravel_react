import { DebounceSettings } from 'lodash';
import debounce from 'lodash/debounce';
import { useEffect, useRef, useState } from 'react';


/**
 * Creates a debounced instance of a function that can be used inside a
 * React component.
 *
 * Usage:
 * const SearchBox = () => {
 *     const [query, setQuery] = useDebouncedState('', 1000);  // 1 sec delay
 * 
 *     // Update to query is debounced.
 *     useEffect(() => {
 *         updateSearchResults(text);
 *     }, [query]);
 * 
 *     return <input onChange={(evt) => { setQuery(evt.target.value)}}>;
 * };
 *
 * @param initialValue Initial value to set the state before any setState calls are made.
 * @param timeout Timeout in milliseconds.
 * @param options Debounce config options.
 */
export default function useDebouncedState<T>(
    initialValue: T,
    timeout: number,
    options?: DebounceSettings
): [T, (value: T) => void] {
    const [currentValue, setCurrrentValue] = useState<T>(initialValue);
    const [newValue, setNewValue] = useState<T>(initialValue);
    const debouncer = useRef<(value: T, setValue: ((value: T) => void)) => void>();

    // Initialize debouncer once.
    useEffect(() => {
        const debounceWrapper = debounce((value: T, setValue: ((value: T) => void)) => {
            setValue(value);
        }, timeout, options);
        debouncer.current = debounceWrapper;

        return () => {
            debounceWrapper.cancel();
        }
    
    }, [options, timeout]);

    // Observes new value and runs the setCurrrentValue through a debouncer.
    useEffect(() => {
        debouncer.current && debouncer.current(newValue, setCurrrentValue);
    }, [newValue]);

    return [currentValue, setNewValue];
}

