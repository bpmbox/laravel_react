import { popProps } from './object-utils';

describe('popProps', () => {
    it('should return array of popped props and remaining props', () => {
        const x = { a: 1, b: 2, c: 3 };

        const [{ a, b }, remainingProps] = popProps(x, 'a', 'b');

        expect(a).toEqual(1);
        expect(b).toEqual(2);
        expect(remainingProps).toStrictEqual({ c: 3 });

        // Should not mutate X
        expect(x).toStrictEqual({ a: 1, b: 2, c: 3 });
    });
});
