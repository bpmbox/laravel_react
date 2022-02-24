import omit from 'lodash/omit';
import pick from 'lodash/pick';

/**
 * Pops properties from an object dictionary and returns the prop values and remaining
 * props as objects.
 *
 * Usage:
 * const x = { a: 1, b: 2, c: 3};
 * const y = popProps(x, 'a', 'b');
 * // y = [
 * //   {a: 1, b:2},
 * //   {c:3},
 * //]
 *
 * @param data Data object
 * @param propNames Names of props we want to pop.
 * @returns [poppedProps, remainingProps]
 */
export function popProps(data: object, ...propNames: string[]): [any, object] {
    return [pick(data, propNames), omit(data, propNames)];
}
