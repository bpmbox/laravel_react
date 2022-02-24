import { useReducer, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import alertService, { ALERT_EVENT } from '../../services/alert';

const _initAlertState: AlertStateType = {
    title: '',
    description: '',
    buttons: [],
    cancelable: true,
};

export function useAlertStore(initAlertState: AlertStateType = _initAlertState) {
    const [state, setState] = useReducer((oldState, newState) => ({ ...oldState, ...newState }), initAlertState);

    const setAlert = (title: string, description: string, buttons: any[], cancelable: boolean) => {
        return setState({ title, description, buttons, cancelable });
    };

    useEffect(() => {
        alertService.addListener(ALERT_EVENT, alertPayload => {
            setAlert(alertPayload.title, alertPayload.description, alertPayload.buttons, alertPayload.cancelable);
        });

        return () => {
            alertService.removeListener(ALERT_EVENT, setAlert);
        };
    }, []);

    return {
        currentAlert: state,
    };
}

export default createContainer(useAlertStore);
