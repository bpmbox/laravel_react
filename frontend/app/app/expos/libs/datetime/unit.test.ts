import { formatChatTime, isLaterThan, isEarlierThan, isLaterThanInDays, isEarlierThanInDays, isLaterThanOrEqualInDays, isEarlierThanOrEqualInDays, isInRangeDays, isDateValid, parseISODateTime } from '.';
import { SinonSandbox } from 'sinon';
import sinon from 'sinon';
import { DateTime } from 'luxon';

describe('formatChatTime', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();

        sandbox.useFakeTimers();
        const today = new Date('2019-12-07 12:00:00');
        sandbox.clock.setSystemTime(today);
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should display expected time if under 24 hours', () => {
        expect(formatChatTime(new Date('2019-12-07 06:00:00'))).toBe('6:00 AM');
    });

    it('should display expected day if under 1 week', () => {
        expect(formatChatTime(new Date('2019-12-03 14:00:00'))).toBe('Tue');
    });

    it('should display month and date if under 1 year', () => {
        expect(formatChatTime(new Date('2019-10-03 14:00:00'))).toBe('Oct 3');
    });

    it('should user friendly calendar date if over a year old', () => {
        expect(formatChatTime(new Date('2017-10-03 14:00:00'))).toBe('Oct 3, 2017');
    });
});

describe('isLaterThan', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();

        sandbox.useFakeTimers();
        const today = new Date('2019-12-07 12:00:00');
        sandbox.clock.setSystemTime(today);
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should confirm that tomorrow is later than today', () => {
        expect(isLaterThan(DateTime.local().plus({ days: 1 }), DateTime.local())).toBeTruthy();
    });

    it('should confirm that yesterday is not later than today', () => {
        expect(isLaterThan(DateTime.local().plus({ days: -1 }), DateTime.local())).toBeFalsy();
    });

    it('should confirm that tomorrow is not earlier than today', () => {
        expect(isEarlierThan(DateTime.local().plus({ days: 1 }), DateTime.local())).toBeFalsy();
    });

    it('should confirm that one minute ago is earlier than now', () => {
        expect(isEarlierThan(DateTime.local().plus({ minutes: -1 }), DateTime.local())).toBeTruthy();
    });

    it('should confirm that 2 days from now is later in days than today', () => {
        expect(isLaterThanInDays(DateTime.local().plus({ days: 2 }), DateTime.local())).toBeTruthy();
    });

    it('should confirm that 2 minutes from now is not later in days than today', () => {
        expect(isLaterThanInDays(DateTime.local().plus({ minutes: 2 }), DateTime.local())).toBeFalsy();
    });

    it('should confirm that 2 months ago is earlier in days than today', () => {
        expect(isEarlierThanInDays(DateTime.local().plus({ months: -2 }), DateTime.local())).toBeTruthy();
    });

    it('should confirm that 2 minutes ago is not earlier in days than now', () => {
        expect(isEarlierThanInDays(DateTime.local().plus({ minutes: -2 }), DateTime.local())).toBeFalsy();
    });

    it('should confirm that 2 minutes ago is later than or equal to now, in days', () => {
        expect(isLaterThanOrEqualInDays(DateTime.local().plus({ minutes: -2 }), DateTime.local())).toBeTruthy();
    });

    it('should confirm that 2 years ago is not later than or equal to now, in days', () => {
        expect(isLaterThanOrEqualInDays(DateTime.local().plus({ years: -2 }), DateTime.local())).toBeFalsy();
    });

    it('should confirm that 2 minutes ago is earlier than or equal to now, in days', () => {
        expect(isEarlierThanOrEqualInDays(DateTime.local().plus({ minutes: -2 }), DateTime.local())).toBeTruthy();
    });

    it('should confirm that 2 weeks from now is not earlier than or equal to now, in days', () => {
        expect(isEarlierThanOrEqualInDays(DateTime.local().plus({ weeks: 2 }), DateTime.local())).toBeFalsy();
    });

    it('should confirm that now is in the range of now - 2 weeks and now + 2 weeks', () => {
        expect(isInRangeDays(DateTime.local(), DateTime.local().plus({ weeks: -2 }), DateTime.local().plus({ weeks: 2 }))).toBeTruthy();
    });

    it('should confirm that today is a valid date', () => {
        expect(isDateValid(DateTime.local())).toBeTruthy();
    });

    it('should confirm that an invalidly formatted date is not a valid date', () => {
        expect(isDateValid(DateTime.fromISO('non_date_string'))).toBeFalsy();
    });

    it('should confirm that an invalidly formatted date is not a valid date', () => {
        expect(parseISODateTime('non_date_string').isValid).toBeFalsy();
    });

    it('should confirm that an validly formatted date parses property', () => {
        expect(parseISODateTime('2020-03-20T00:00:00+00').year).toBe(2020);
    });
});
