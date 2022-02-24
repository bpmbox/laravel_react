import { evaluateExpression } from './expressions-parser';
import { SinonSandbox } from 'sinon';
import sinon from 'sinon';
import { DateTime } from 'luxon';
import { PageProp } from '../integration/pageRenderer';

describe('expressions-parser', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    // -- Block and Prop Operators --

    describe('prop', () => {
        it('should evaluate documentation example', () => {
            let prop: PageProp;

            prop = { name: 'name', type: 'text', value: JSON.stringify('Tree') };
            expect(evaluateExpression("Hello ${prop('name')}", [prop], {}, null, null)).toBe('Hello Tree');

            prop = { name: 'counter', type: 'number', value: JSON.stringify(1) };
            expect(evaluateExpression("Counter = ${prop('counter') + 1}", [prop], {}, null, null)).toBe('Counter = 2');

            // TODO: need to standardize timezone for dates.
            // sandbox.useFakeTimers();
            // const today = DateTime.local();
            // sandbox.clock.setSystemTime(today.toJSDate());
            // prop = { name: 'date', type: 'date', value: JSON.stringify(today) };
            // expect(evaluateExpression('${prop(\'date\')}', [prop] , {}, null, null)).toBe('value is true');
        });

        it('should evaluate non-existent prop as empty', () => {
            let prop: PageProp;
            prop = { name: 'x', type: 'text', value: JSON.stringify('a') };
            expect(evaluateExpression("value is ${prop('y')}", [prop], {}, null, null)).toBe('value is ');
        });
    });

    // TODO: not yet implemented.
    // eslint-disable-next-line jest/no-disabled-tests
    describe.skip('get', () => {
        it('should evaluate non-existent prop as empty', () => {
            let prop: PageProp = { name: 'item', type: 'text', value: JSON.stringify({ name: 'Tree' }) };
            expect(evaluateExpression('value is ${get(item, name)}', [prop], {}, null, null)).toBe('value is Tree');
        });
    });

    // -- Boolean Operators --

    describe('if', () => {
        it('should evaluate if', () => {
            const props: PageProp[] = [
                { name: 'x', type: 'text', value: JSON.stringify('a') },
                { name: 'y', type: 'text', value: JSON.stringify('b') },
                { name: 'z1', type: 'boolean', value: JSON.stringify(true) },
                { name: 'z2', type: 'boolean', value: JSON.stringify(false) },
            ];
            expect(evaluateExpression("value is ${if(prop('z1'), prop('x'), prop('y'))}", props, {}, null, null)).toBe(
                'value is a'
            );
            expect(evaluateExpression("value is ${if(prop('z2'), prop('x'), prop('y'))}", props, {}, null, null)).toBe(
                'value is b'
            );
        });
    });

    describe('not', () => {
        it('should evaluate not', () => {
            const props: PageProp[] = [
                { name: 'x', type: 'text', value: JSON.stringify('a') },
                { name: 'y', type: 'text', value: JSON.stringify('b') },
                { name: 'z1', type: 'boolean', value: JSON.stringify(true) },
                { name: 'z2', type: 'boolean', value: JSON.stringify(false) },
            ];
            expect(
                evaluateExpression("value is ${if(not(prop('z1')), prop('x'), prop('y'))}", props, {}, null, null)
            ).toBe('value is b');
            expect(
                evaluateExpression("value is ${if(not(prop('z2')), prop('x'), prop('y'))}", props, {}, null, null)
            ).toBe('value is a');
        });
    });

    describe('and', () => {
        it('should evaluate and', () => {
            const props: PageProp[] = [
                { name: 'x', type: 'text', value: JSON.stringify('a') },
                { name: 'y', type: 'text', value: JSON.stringify('b') },
                { name: 'z1', type: 'boolean', value: JSON.stringify(true) },
                { name: 'z2', type: 'boolean', value: JSON.stringify(false) },
                { name: 'z3', type: 'boolean', value: JSON.stringify(true) },
            ];
            expect(
                evaluateExpression(
                    "value is ${if(and(prop('z1'), prop('z3')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is a');
            expect(
                evaluateExpression(
                    "value is ${if(and(prop('z1'), prop('z2')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is b');
        });
    });

    describe('or', () => {
        it('should evaluate or', () => {
            const props: PageProp[] = [
                { name: 'x', type: 'text', value: JSON.stringify('a') },
                { name: 'y', type: 'text', value: JSON.stringify('b') },
                { name: 'z1', type: 'boolean', value: JSON.stringify(true) },
                { name: 'z2', type: 'boolean', value: JSON.stringify(false) },
                { name: 'z3', type: 'boolean', value: JSON.stringify(true) },
            ];
            expect(
                evaluateExpression(
                    "value is ${if(or(prop('z1'), prop('z3')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is a');
            expect(
                evaluateExpression(
                    "value is ${if(or(prop('z1'), prop('z2')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is a');
        });
    });

    // -- Comparison Operators --

    describe('equal', () => {
        it('should evaluate equal', () => {
            const props: PageProp[] = [
                { name: 'x', type: 'text', value: JSON.stringify('a') },
                { name: 'y', type: 'text', value: JSON.stringify('b') },
                { name: 'z1', type: 'number', value: JSON.stringify(1) },
                { name: 'z2', type: 'number', value: JSON.stringify(2) },
                { name: 'z3', type: 'number', value: JSON.stringify(1) },
            ];
            expect(
                evaluateExpression(
                    "value is ${if(equal(prop('z1'), prop('z3')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is a');
            expect(
                evaluateExpression(
                    "value is ${if(equal(prop('z1'), prop('z2')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is b');
        });
    });

    describe('notEqual', () => {
        it('should evaluate notEqual', () => {
            const props: PageProp[] = [
                { name: 'x', type: 'text', value: JSON.stringify('a') },
                { name: 'y', type: 'text', value: JSON.stringify('b') },
                { name: 'z1', type: 'number', value: JSON.stringify(1) },
                { name: 'z2', type: 'number', value: JSON.stringify(2) },
                { name: 'z3', type: 'number', value: JSON.stringify(1) },
            ];
            expect(
                evaluateExpression(
                    "value is ${if(notEqual(prop('z1'), prop('z3')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is b');
            expect(
                evaluateExpression(
                    "value is ${if(notEqual(prop('z1'), prop('z2')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is a');
        });
    });

    describe('greaterThan', () => {
        it('should evaluate greaterThan', () => {
            const props: PageProp[] = [
                { name: 'x', type: 'text', value: JSON.stringify('a') },
                { name: 'y', type: 'text', value: JSON.stringify('b') },
                { name: 'z1', type: 'number', value: JSON.stringify(1) },
                { name: 'z2', type: 'number', value: JSON.stringify(2) },
                { name: 'z3', type: 'number', value: JSON.stringify(1) },
            ];
            expect(
                evaluateExpression(
                    "value is ${if(greaterThan(prop('z1'), prop('z2')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is b');
            expect(
                evaluateExpression(
                    "value is ${if(greaterThan(prop('z1'), prop('z3')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is b');
            expect(
                evaluateExpression(
                    "value is ${if(greaterThan(prop('z2'), prop('z1')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is a');
        });
    });

    describe('greaterThanEq', () => {
        it('should evaluate greaterThanEq', () => {
            const props: PageProp[] = [
                { name: 'x', type: 'text', value: JSON.stringify('a') },
                { name: 'y', type: 'text', value: JSON.stringify('b') },
                { name: 'z1', type: 'number', value: JSON.stringify(1) },
                { name: 'z2', type: 'number', value: JSON.stringify(2) },
                { name: 'z3', type: 'number', value: JSON.stringify(1) },
            ];
            expect(
                evaluateExpression(
                    "value is ${if(greaterThanEq(prop('z1'), prop('z2')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is b');
            expect(
                evaluateExpression(
                    "value is ${if(greaterThanEq(prop('z1'), prop('z3')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is a');
            expect(
                evaluateExpression(
                    "value is ${if(greaterThanEq(prop('z2'), prop('z1')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is a');
        });
    });

    describe('smallerThan', () => {
        it('should evaluate smallerThan', () => {
            const props: PageProp[] = [
                { name: 'x', type: 'text', value: JSON.stringify('a') },
                { name: 'y', type: 'text', value: JSON.stringify('b') },
                { name: 'z1', type: 'number', value: JSON.stringify(1) },
                { name: 'z2', type: 'number', value: JSON.stringify(2) },
                { name: 'z3', type: 'number', value: JSON.stringify(1) },
            ];
            expect(
                evaluateExpression(
                    "value is ${if(smallerThan(prop('z1'), prop('z2')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is a');
            expect(
                evaluateExpression(
                    "value is ${if(smallerThan(prop('z1'), prop('z3')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is b');
            expect(
                evaluateExpression(
                    "value is ${if(smallerThan(prop('z2'), prop('z1')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is b');
        });
    });

    describe('smallerThanEq', () => {
        it('should evaluate smallerThanEq', () => {
            const props: PageProp[] = [
                { name: 'x', type: 'text', value: JSON.stringify('a') },
                { name: 'y', type: 'text', value: JSON.stringify('b') },
                { name: 'z1', type: 'number', value: JSON.stringify(1) },
                { name: 'z2', type: 'number', value: JSON.stringify(2) },
                { name: 'z3', type: 'number', value: JSON.stringify(1) },
            ];
            expect(
                evaluateExpression(
                    "value is ${if(smallerThanEq(prop('z1'), prop('z2')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is a');
            expect(
                evaluateExpression(
                    "value is ${if(smallerThanEq(prop('z1'), prop('z3')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is a');
            expect(
                evaluateExpression(
                    "value is ${if(smallerThanEq(prop('z2'), prop('z1')), prop('x'), prop('y'))}",
                    props,
                    {},
                    null,
                    null
                )
            ).toBe('value is b');
        });
    });

    describe('add', () => {
        // TODO: currently failing.
        // eslint-disable-next-line jest/no-disabled-tests
        it.skip('should evaluate add', () => {
            const props: PageProp[] = [
                { name: 'a', type: 'number', value: JSON.stringify(-1) },
                { name: 'b', type: 'number', value: JSON.stringify(-2) },
                { name: 'c', type: 'number', value: JSON.stringify(-4) },
                { name: 'x', type: 'number', value: JSON.stringify(1) },
                { name: 'y', type: 'number', value: JSON.stringify(2) },
                { name: 'z', type: 'number', value: JSON.stringify(4) },
            ];
            expect(evaluateExpression("value is ${add(prop('x'),prop('y'))}", props, {}, null, null)).toBe(
                'value is 3'
            );
            expect(evaluateExpression("value is ${add(prop('a'),prop('x'))}", props, {}, null, null)).toBe(
                'value is 0'
            );
            expect(evaluateExpression("value is ${add(prop('a'),prop('b'))}", props, {}, null, null)).toBe(
                'value is -3'
            );
        });
    });

    describe('subtract', () => {
        // TODO: currently failing.
        // eslint-disable-next-line jest/no-disabled-tests
        it.skip('should evaluate subtract', () => {
            const props: PageProp[] = [
                { name: 'a', type: 'number', value: JSON.stringify(-1) },
                { name: 'b', type: 'number', value: JSON.stringify(-2) },
                { name: 'c', type: 'number', value: JSON.stringify(-4) },
                { name: 'm', type: 'number', value: JSON.stringify(0) },
                { name: 'x', type: 'number', value: JSON.stringify(1) },
                { name: 'y', type: 'number', value: JSON.stringify(2) },
                { name: 'z', type: 'number', value: JSON.stringify(4) },
            ];
            expect(evaluateExpression("value is ${subtract(prop('x'),prop('y'))}", props, {}, null, null)).toBe(
                'value is -1'
            );
            expect(evaluateExpression("value is ${subtract(prop('a'),prop('x'))}", props, {}, null, null)).toBe(
                'value is -2'
            );
            expect(evaluateExpression("value is ${subtract(prop('a'),prop('b'))}", props, {}, null, null)).toBe(
                'value is 1'
            );
            expect(evaluateExpression("value is ${subtract(prop('x'),prop('m'))}", props, {}, null, null)).toBe(
                'value is 1'
            );
            expect(evaluateExpression("value is ${subtract(prop('a'),prop('a'))}", props, {}, null, null)).toBe(
                'value is 0'
            );
        });
    });

    // -- Date Operators --

    describe('today', () => {
        // TODO: currently failing.
        // eslint-disable-next-line jest/no-disabled-tests
        it.skip('should evaluate to today', () => {
            sandbox.useFakeTimers();
            const today = DateTime.fromISO('2020-03-16 12:00:00Z');
            sandbox.clock.setSystemTime(today.toJSDate());
            const result = evaluateExpression('Today is ${today()}', {}, {}, null, null);
            expect(result).toBe('Today is ' + today.startOf('day').toString());
        });
    });
});
