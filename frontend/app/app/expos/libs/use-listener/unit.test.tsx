import { renderHook, act } from '@testing-library/react-hooks';
import { act as renderAct } from 'react-dom/test-utils';
import useListener from '.';
import sinon, { SinonSandbox } from 'sinon';
import { EventEmitter } from 'events';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { mount } from 'enzyme';

describe('useListener', () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('Should add listner only once on mount, and remove listener on ummount', async () => {
        const listener = sandbox.stub();
        const emitter = new EventEmitter();
        const event = 'TEST';

        const addListener = sinon.spy(emitter, 'addListener');
        const removeListener = sinon.spy(emitter, 'removeListener');

        const { unmount, rerender } = renderHook(() => useListener(emitter, event, listener));

        // Check listener added
        expect(addListener.calledOnce).toBeTruthy();

        // Check listener is really added by emittin g an event and verifying it got listened to.
        act(() => {
            // Placing it within an act in order to trigger possible rerenders.
            emitter.emit(event, 'For the watch!');
        });
        expect(listener.calledWith('For the watch!')).toBeTruthy();
        listener.resetHistory();

        // Check listener only called once.
        rerender();
        expect(addListener.calledOnce).toBeTruthy();

        // Check listener removed when component unmounted.
        unmount();
        expect(removeListener.calledOnce).toBeTruthy();

        // Check listener is really removed by emitting an event and verifying it was not listened to.
        emitter.emit(event, 'For the watch!');
        expect(listener.calledWith('For the watch!')).toBeFalsy();
        listener.resetHistory();
    });

    it('test using in a rendered component through several cycles', async () => {
        const emitter = new EventEmitter();
        const event = 'TEST';

        const addListener = sinon.spy(emitter, 'addListener');
        const removeListener = sinon.spy(emitter, 'removeListener');

        const TestComponent = ({ service }) => {
            const [count, setCount] = useState<number>(0);

            const handleValueChange = value => {
                setCount(count + value);
            };

            useListener(service, event, handleValueChange);

            return (
                <View>
                    <Text>value is {count}</Text>
                </View>
            );
        };

        const wrapper = mount(<TestComponent service={emitter} />);
        wrapper.update();

        // check precondition.
        expect(wrapper.text()).toBe('value is 0');

        // perform a series of update and verify the text gets updated through multiple cycles.
        renderAct(() => {
            emitter.emit(event, 1);
        });
        await new Promise(setImmediate);
        wrapper.update();
        expect(wrapper.text()).toBe('value is 1');

        renderAct(() => {
            emitter.emit(event, 5);
        });
        await new Promise(setImmediate);
        wrapper.update();
        expect(wrapper.text()).toBe('value is 6');

        renderAct(() => {
            emitter.emit(event, 4);
        });
        await new Promise(setImmediate);
        wrapper.update();
        expect(wrapper.text()).toBe('value is 10');

        renderAct(() => {
            emitter.emit(event, 5);
        });
        await new Promise(setImmediate);
        wrapper.update();
        expect(wrapper.text()).toBe('value is 15');

        renderAct(() => {
            emitter.emit(event, 10);
        });
        await new Promise(setImmediate);
        wrapper.update();
        expect(wrapper.text()).toBe('value is 25');

        wrapper.unmount();

        // Verify listener was only add once and removed once.
        expect(addListener.calledOnce).toBeTruthy();
        expect(removeListener.calledOnce).toBeTruthy();
    });
});
