import { AlertService, ALERT_EVENT } from '.';

describe('AlertService', () => {
    it('should emit event corresponding to the action type.', () => {
        const listener = jest.fn();

        const alertService = new AlertService();
        alertService.addListener(ALERT_EVENT, listener);

        alertService.alert('Foo', 'Bar', []);
        expect(listener).toBeCalledWith({
            title: 'Foo',
            description: 'Bar',
            buttons: [],
        });
    });
});
