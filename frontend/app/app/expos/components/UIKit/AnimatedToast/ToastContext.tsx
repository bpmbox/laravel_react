import React, { createContext, useState, useEffect, useRef, useCallback, useContext } from 'react';
  
const initialToast = {
    message: '',
    type: null,
    visible: false
};

const MESSAGE_TOAST_FADEOUT_TIMEOUT = 4000;
const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({children}) => {
    const [toast, setToast] = useState(initialToast);
    const timeout = useRef();

    const show = useCallback(args => {
        setToast({...initialToast, visible: true, ...args});
    }, []);

    const hide = useCallback(() => {
        setToast({...toast, visible: false});
    }, [toast]);

    useEffect(() => {
        if (toast.visible) {
            timeout.current = setTimeout(hide, MESSAGE_TOAST_FADEOUT_TIMEOUT) as any;
            return () => {
                clearTimeout(timeout.current);
            };
        }
    }, [hide, toast]);

    return (
        <ToastContext.Provider value={{ hide, show, toast }}>
            {children}
        </ToastContext.Provider>
    );
};
