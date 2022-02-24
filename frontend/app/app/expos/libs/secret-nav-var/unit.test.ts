import { getSecretNavigationVar, setSecretNavigationVar, clearSecretNavigationVar } from '.';

describe('secret-nav-var', () => {
    it('should get/set variable', () => {
        const fakeNav = {
            state: {
                key: 'some_route_key',
            },
        };

        setSecretNavigationVar((fakeNav as unknown) as any, 'motto', 'For the watch!', {
            current: true,
        });

        const value = getSecretNavigationVar((fakeNav as unknown) as any, 'motto');
        expect(value).toBe('For the watch!');
    });

    it('should clear variable', () => {
        const fakeNav = {
            state: {
                key: 'some_route_key',
            },
        };

        setSecretNavigationVar((fakeNav as unknown) as any, 'motto', 'For the watch!', {
            current: true,
        });

        clearSecretNavigationVar((fakeNav as unknown) as any, 'motto');

        const value = getSecretNavigationVar((fakeNav as unknown) as any, 'motto');
        expect(value).not.toBeDefined();
    });
});
