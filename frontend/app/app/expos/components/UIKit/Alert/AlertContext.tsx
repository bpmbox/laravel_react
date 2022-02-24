import React, { createContext, useState, useCallback, useContext } from 'react';
  
const initialAlert = {
    title: '',
    description: '',
    buttons: [],
    cancelable: true,
    visible: false,
};

const AlertContext = createContext(null);

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({children}) => {
    const [alert, setAlert] = useState(initialAlert);

    const show = useCallback(args => {
        setAlert({...initialAlert, visible: true, ...args});
    }, []);

    const hide = useCallback(() => {
        setAlert({...alert, visible: false});
    }, [alert]);

    return (
        <AlertContext.Provider value={{ hide, show, alert }}>
            {children}
        </AlertContext.Provider>
    );
};
