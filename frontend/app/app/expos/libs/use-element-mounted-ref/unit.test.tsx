import useElementMountedRef from '.';
import { renderHook } from '@testing-library/react-hooks';

describe('useElementMountedRef', () => {
    it('should be true when component is mounted, and false when unmounted', () => {
        const { result, unmount } = renderHook(() => useElementMountedRef());

        expect(result.current.current).toBeTruthy();

        unmount();

        expect(result.current.current).toBeFalsy();
    });
});
