import { EventEmitter } from 'events';
import { Alert } from 'react-native';

export const ALERT_EVENT = 'ALERT_EVENT';

/**
 * AlertService is a global service for showing messages in alert dialogs on desktop.
 * This service emits events, which is consumed by the <Alert> component
 * which is subscribed to this service's event stream.
 */
export class AlertService extends EventEmitter implements AlertServiceTypes.IAlertService {
    alert(title?: string, description?: string, buttons?: any[], cancelable?: boolean) {
        Alert.alert(title, description, buttons, { cancelable: cancelable });

        const alertPayload: AlertServiceTypes.IAlertEventPayload = {
            title,
            description,
            buttons,
            cancelable,
        };
        this.emit(ALERT_EVENT, alertPayload);
    }
}

const alertService = new AlertService();

export default alertService;
