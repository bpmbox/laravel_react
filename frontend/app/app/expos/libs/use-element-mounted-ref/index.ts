import { useRef, useEffect } from 'react';

export default function useElementMountedRef() {
    const mountedRef = useRef<boolean>(false);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        }
    });

    return mountedRef;
}
