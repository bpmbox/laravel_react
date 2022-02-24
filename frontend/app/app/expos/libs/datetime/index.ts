import { DateTime } from 'luxon';
import i18n from '../../i18n';

// Warning: Luxon is not fully supported on some platform, like
// RN Android. So we cannot use localizable formats, like 't' or
// toLocaleString({ month: 'long', year: 'numeric' }).
// We currently only support fixed 'h:mm a' time format rather than
// the localizable 't' format.
export const timeFormat = 'h:mm a';
export const dateFormat = 'd LLL, yyyy';
export const dateTimeFormat = 'd LLL, yyyy t';
export const monthYearFormat = 'DDD';

const isWithin24Hours = (date: DateTime, otherDate: DateTime): boolean => {
    return date.diff(otherDate, 'hours').hours <= 24;
};

const isWithin7Days = (date: DateTime, otherDate: DateTime): boolean => {
    return date.diff(otherDate, 'days').days <= 7;
};

const isWithin365Days = (date: DateTime, otherDate: DateTime): boolean => {
    return date.diff(otherDate, 'days').days <= 365;
};

/**
 * Format Time for Chat
 * @param d DateTime in the form of JS Date object or as a Luxon DateTime
 */
export const formatChatTime = (d: DateTime | Date): string => {
    const now = DateTime.fromJSDate(new Date());
    const date = d instanceof DateTime ? d : DateTime.fromJSDate(d as Date);

    if (isWithin24Hours(now, date)) {
        return date.toFormat('t');
    }
    if (isWithin7Days(now, date)) {
        return date.toFormat('ccc');
    }
    if (isWithin365Days(now, date)) {
        return date.toFormat('MMM d');
    }
    return date.toFormat('DD');
};

export const shortWeekdayNames = [
    i18n.t("Mo"),
    i18n.t("Tu"),
    i18n.t("We"),
    i18n.t("Th"),
    i18n.t("Fr"),
    i18n.t("Sa"),
    i18n.t("Su"),
]

export const isLaterThan = (baseDate: DateTime, otherDate: DateTime): boolean => {
    // Returns true if baseDate is later than otherDate.
    return baseDate.diff(otherDate, 'milliseconds').milliseconds > 0;
}

export const isEarlierThan = (baseDate: DateTime, otherDate: DateTime): boolean => {
    // Returns true if baseDate is earlier than otherDate.
    return baseDate.diff(otherDate, 'milliseconds').milliseconds < 0;
}

export const isLaterThanInDays = (baseDate: DateTime, otherDate: DateTime): boolean => {
    // Returns true if baseDate is later than otherDate, with 'day'
    // granularity
    return baseDate.startOf('day').diff(otherDate.startOf('day'), 'days').days > 0;
}

export const isEarlierThanInDays = (baseDate: DateTime, otherDate: DateTime): boolean => {
    // Returns true if baseDate is earlier than otherDate, with 'day'
    // granularity
    return baseDate.startOf('day').diff(otherDate.startOf('day'), 'days').days < 0;
}

export const isLaterThanOrEqualInDays = (baseDate: DateTime, otherDate: DateTime): boolean => {
    // Returns true if baseDate is later than or equal to otherDate, with 'day'
    // granularity
    return isLaterThanInDays(baseDate, otherDate) || baseDate.hasSame(otherDate, 'day');
}

export const isEarlierThanOrEqualInDays = (baseDate: DateTime, otherDate: DateTime): boolean => {
    // Returns true if baseDate is earlier than or equal to otherDate, with 
    // 'day' granularity
    return isEarlierThanInDays(baseDate, otherDate) || baseDate.hasSame(otherDate, 'day');
}

export const isInRangeDays = (date: DateTime, startDate: DateTime, endDate: DateTime): boolean => {
    return date.hasSame(startDate, 'day') || date.hasSame(endDate, 'day') || (isLaterThanInDays(date, startDate) && isEarlierThanInDays(date, endDate));
}

export const isDateValid = (date: DateTime | null): boolean => {
    return !!date && date.isValid;
}

export const parseISODateTime = (text?: string): DateTime | null => {
    try {
        return DateTime.fromISO(text);
    } catch {
        return null;
    }
}