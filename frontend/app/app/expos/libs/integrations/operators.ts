import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import { capitalize } from '../../libs/string-utils';
import { parseISODateTime } from '../../libs/datetime/';
import uniq from 'lodash/uniq';
import { DateTime } from 'luxon';
import defaultTo from 'lodash/defaultTo';

export const evalProp = (pageProps) => (name) => {
    const foundProp = pageProps.find((prop) => { return prop.name === name });
    const value = get(foundProp, 'value', null);
    const propType = get(foundProp, 'type', null);
    try {
        if (typeof value === 'string') {
            return JSON.parse(value);
        } else if (propType === 'date') {
            return {
                ...value,
                startDate: parseISODateTime(value.startDate),
                endDate: parseISODateTime(value.endDate),
            };
        }
    } catch {}
    return value;
}

const devConsoleLog = (...message) => {
    // For the future developer console log
    console.log(...message);
}

// Boolean operators

export const evalIf = (condition: boolean, valueIfTrue: any, valueIfFalse: any): any => {
    return condition ? valueIfTrue : valueIfFalse;
}

export const evalNot = (value: boolean): boolean => {
    return !value;
}

export const evalAnd = (a: boolean, b: boolean): boolean => {
    return a && b;
}

export const evalOr = (a: boolean, b: boolean): boolean => {
    return a || b;
}

// Comparison operators

export const evalEqual = (a: any, b: any): boolean => {
    return a === b;
}

export const evalNotEqual = (a: any, b: any): boolean => {
    return a !== b;
}

export const evalGreaterThan = (a: number, b: number): boolean => {
    return a > b;
}

export const evalGreaterThanEq = (a: number, b: number): boolean => {
    return a >= b;
}

export const evalSmallerThan = (a: number, b: number): boolean => {
    return a < b;
}

export const evalSmallerThanEq = (a: number, b: number): boolean => {
    return a <= b;
}

// Arithmetic operators

export const evalAdd = (a: number, b: number): number => {
    return a + b;
}

export const evalSubtract = (a: number, b: number): number => {
    return a - b;
}

export const evalMultiply = (a: number, b: number): number => {
    return a * b;
}

export const evalDivide = (a: number, b: number): number => {
    return a / b;
}

export const evalMinus = (a: number): number => {
    return -a;
}

export const evalMod = (a: number, b: number): number => {
    return a % b;
}

export const evalIsEven = (a: number): boolean => {
    return a % 2 === 0;
}

export const evalIsOdd = (a: number): boolean => {
    return a % 2 !== 0;
}

export const evalAbs = (a: number): number => {
    return Math.abs(a);
}

export const evalLn = (a: number): number => {
    return Math.log(a);
}

export const evalLog2 = (a: number): number => {
    return Math.log2(a);
}

export const evalLog10 = (a: number): number => {
    return Math.log10(a);
}

export const evalExp = (a?: number): number => {
    return Math.exp(defaultTo(a, 1));
}

export const evalPow = (a: number, b: number): number => {
    return Math.pow(a, b);
}

export const evalSqrt = (a: number): number => {
    return Math.sqrt(a);
}

export const evalRound = (a: number): number => {
    return Math.round(a);
}

export const evalFloor = (a: number): number => {
    return Math.floor(a);
}

export const evalCeil = (a: number): number => {
    return Math.ceil(a);
}

export const evalSign = (a: number): number => {
    return Math.sign(a);
}

export const evalMin = (...numbers): number => {
    return Math.min(...numbers);
}

export const evalMax = (...numbers): number => {
    return Math.max(...numbers);
}

export const evalRand = (): number => {
    return Math.random();
}

export const evalPi = (): number => {
    return Math.PI;
}

// String operators

export const evalToString = (value: any): string => {
    return JSON.stringify(value);
}

export const evalToNumber = (text: string): number => {
    try {
        return Number(text);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return 0;
    }
}

export const evalTrim = (text: any): any => {
    try {
        return text.trim();
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return text;
    }
}

export const evalStartsWith = (text: any, start: any): boolean => {
    try {
        return text.startsWith(start);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return false;
    }
}

export const evalReplace = (text: string, searchValue: string, newValue: string): string => {
    try {
        return text.replace(searchValue, newValue);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return text;
    }
}

export const evalReplaceAll = (text: string, searchValue: string, newValue: string): string => {
    try {
        return text.replace(new RegExp(searchValue, 'g'), newValue);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return text;
    }
}

export const evalUppercase = (text: any): any => {
    try {
        return text.toUpperCase();
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return text;
    }
}

export const evalLowercase = (text: any): any => {
    try {
        return text.toLowerCase();
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return text;
    }
}

export const evalCapitalize = (text: any): any => {
    try {
        return capitalize(text);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return text;
    }
}

// Array  operators

export const evalAppend = (array: any, value: any): any => {
    try {
        return array.concat([value]);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return array;
    }
}

export const evalInsertAt = (array: any, value: any, index: number): any => {
    try {
        return [...array.slice(0, index), value, ...array.slice(index)];
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return array;
    }
}

export const evalIndexOf = (array: any, value: any): number => {
    try {
        return array.indexOf(value);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return -1;
    }
}

export const evalElementAt = (array: any, index: number): any => {
    try {
        return array[index];
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return null;
    }
}

export const evalSort = (array: any): any => {
    try {
        return array.sort();
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return array;
    }
}

export const evalUniq = (array: any): any => {
    try {
        return uniq(array);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return array;
    }
}

export const evalReverse = (array: any): any => {
    try {
        return array.reverse();
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return array;
    }
}

// Date operators

export const evalNow = (): DateTime => {
    return DateTime.local();
}

export const evalToday = (): DateTime => {
    return DateTime.local().startOf('day');
}

export const evalYesterday = (): DateTime => {
    return DateTime.local().plus({ days: -1 }).startOf('day');
}

export const evalTomorrow = (): DateTime => {
    return DateTime.local().plus({ days: 1 }).startOf('day');
}

export const evalTimestamp = (datetime: DateTime): number => {
    try {
        return datetime.toMillis();
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return 0;
    }
}

export const evalFromTimestamp = (millis: number): DateTime => {
    try {
        return DateTime.fromMillis(millis);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return DateTime.local();
    }
}

export const evalSeconds = (datetime: DateTime): number => {
    try {
        return datetime.second;
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return 0;
    }
}

export const evalMinute = (datetime: DateTime): number => {
    try {
        return datetime.minute;
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return 0;
    }
}

export const evalHour = (datetime: DateTime): number => {
    try {
        return datetime.hour;
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return 0;
    }
}

export const evalWeekday = (datetime: DateTime): number => {
    try {
        return datetime.weekday;
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return 0;
    }
}

export const evalWeekNumber = (datetime: DateTime): number => {
    try {
        return datetime.weekNumber;
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return 0;
    }
}

export const evalDay = (datetime: DateTime): number => {
    try {
        return datetime.day;
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return 0;
    }
}

export const evalMonth = (datetime: DateTime): number => {
    try {
        return datetime.month;
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return 0;
    }
}

export const evalYear = (datetime: DateTime): number => {
    try {
        return datetime.year;
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return 0;
    }
}

// export const evalEvalStart = (datetime: DateTime): number => {

// }

// export const evalEnd = (datetime: DateTime): number => {

// }

type DURATION_UNITS = 'year' | 'years' | 'quarter' | 'quarters'
    | 'month' | 'months' | 'week' | 'weeks' | 'day' | 'days' | 'hour'
    | 'hours' | 'minute' | 'minutes' | 'second' | 'seconds'
    | 'millisecond' | 'milliseconds';

export const evalAddToDate = (datetime: DateTime, duration: number, unit: string): DateTime => {
    try {
        const validUnit = unit as DURATION_UNITS;
        return datetime.plus({ [validUnit]: duration});
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return datetime;
    }
}

export const evalDateDifference = (datetime1: DateTime, datetime2: DateTime, unit: string): number => {
    try {
        const validUnit = unit as DURATION_UNITS;
        return get(datetime1.diff(datetime2, validUnit).toObject(), validUnit, 0)
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return 0;
    }
}

export const evalFormat = (datetime: DateTime, format: string): string => {
    try {
        return datetime.toFormat(format);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        try {
            return datetime.toFormat('yyyy LLL dd');
        } catch (e2) {
            return '';
        }
    }
}

// Polymorphic operators

export const evalLength = (o: any): number => {
    try {
        return o.length;
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return 0;
    }
}

export const evalIsEmpty = (o: any): boolean => {
    try {
        return isEmpty(o);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return true;
    }
}

export const evalConcat = (a: any, b: any): any => {
    try {
        return a.concat(b);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return '';
    }
}

export const evalContains = (a: any, b: any): boolean => {
    try {
        return a.includes(b);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return false;
    }
}

export const evalHas = (object, path): boolean => {
    try {
        return has(object, path);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return false;
    }
}

export const evalJoin = (separator: string, ...values): any => {
    // `values` can be either a list of arguments, e.g.
    // `join("-", 1, 2, 3)`, or an array, e.g. `join("-", [1, 2, 3])`.
    try {
        return values.flat().join(separator);
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return '';
    }
}

export const evalSlice = (o: any, start: number, end?: number): string => {
    try {
        if (end) {
            return o.slice(start, end);
        } else {
            return o.slice(start);
        }
    } catch (e) {
        devConsoleLog("Eval error:" , e);
        return o;
    }
}
