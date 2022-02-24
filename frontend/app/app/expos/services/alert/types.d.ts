declare namespace AlertServiceTypes {
    interface IAlertService {
        alert: (title?: string, description?: string, buttons?: any[], cancelable?: boolean) => void;
    }

    interface IAlertEventPayload {
        title?: string;
        description?: string;
        buttons?: any[];
        cancelable?: boolean;
    }
}
