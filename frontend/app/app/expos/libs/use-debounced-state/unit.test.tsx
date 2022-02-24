import { renderHook } from '@testing-library/react-hooks';
import { mount } from 'enzyme';
import React, { useEffect, useState } from 'react';
import { act } from 'react-dom/test-utils';
import sinon, { SinonSandbox } from 'sinon';
import useDebouncedState from '.';
import { awaitPromises } from '../../test-fixtures/component-test-utils';

describe('useListener', () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.useFakeTimers();
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('should debounce state updates.', async () => {
        const { result } = renderHook(() => useDebouncedState(0, 200, { maxWait: 500 }));
        await new Promise(resolve => {
            setTimeout(resolve, 100);
            sandbox.clock.tick(100);
        });

        // Assert initial state
        expect(result.current[0]).toBe(0);

        // Perform 3 updates, should only take last update.
        result.current[1](1);
        await new Promise(resolve => {
            setTimeout(resolve, 100);
            sandbox.clock.tick(100);
        });
        act(() => {});

        // Assert the current value hasn't changed yet, debounce timeout still hasn't completed.
        expect(result.current[0]).toBe(0);

        result.current[1](2);
        await new Promise(resolve => {
            setTimeout(resolve, 100);
            sandbox.clock.tick(100);
        });
        act(() => {});
        // Assert the current value hasn't changed yet, debounce timeout still hasn't completed.
        expect(result.current[0]).toBe(0);

        // Setting value to 3, when wait long enough for the debounce to finish waiting.
        result.current[1](3);
        await new Promise(resolve => {
            setTimeout(resolve, 1100);
            sandbox.clock.tick(1100);
        });
        act(() => {});
        expect(result.current[0]).toBe(3);
    });

    it('should debounce when used within a React component.', async () => {
        const TestComp = () => {
            const [count, setCount] = useDebouncedState(0, 1000);
            const [clickCount, setClickCount] = useState(0);

            useEffect(() => {
                setCount(count + 1);
            }, [clickCount, count, setCount]);

            return (
                <div>
                    <span id="count">{count}</span>
                    <span id="clickCount">{clickCount}</span>
                    <button onClick={() => setClickCount(clickCount + 1)}>click me</button>
                </div>
            );
        };

        const wrapper = mount(<TestComp />);
        await awaitPromises(sandbox.clock);
        // Validate initial conditions.
        wrapper.update();
        expect(wrapper.find('#count').text()).toBe('0');
        expect(wrapper.find('#clickCount').text()).toBe('0');

        // Click 3 times rapidly, click count should update 3x, but
        // debounced count should not yet increment.
        act(() => {
            wrapper.find('button').simulate('click');
        });
        await awaitPromises(sandbox.clock);
        wrapper.update();
        act(() => {
            wrapper.find('button').simulate('click');
        });
        await awaitPromises(sandbox.clock);
        wrapper.update();
        act(() => {
            wrapper.find('button').simulate('click');
        });
        await awaitPromises(sandbox.clock);
        wrapper.update();
        expect(wrapper.find('#count').text()).toBe('0');
        expect(wrapper.find('#clickCount').text()).toBe('3');

        // Await for the debounce to complete.
        await awaitPromises(sandbox.clock, 1000);
        expect(wrapper.find('#count').text()).toBe('1');
        expect(wrapper.find('#clickCount').text()).toBe('3');

        // Unmount.  Make sure nothing crashes on unmount.
        wrapper.unmount();
    });
});
