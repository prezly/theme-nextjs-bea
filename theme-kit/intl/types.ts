export type Timezone = string;
/**
 * - 'D/M/YY'
 * - 'M/D/YY'
 * - 'YY/M/D'
 * - 'MMM D, YY'
 * - 'MMM D, YYYY'
 * - 'DD/MM/YYYY'
 * - 'MM/DD/YYYY'
 * - 'DD.MM.YYYY'
 */
export type DateFormat = string;
/**
 * - 'hh:mm a'
 * - 'HH:mm'
 */
export type TimeFormat = string;
export type Iso8601Date = string;

export type IntlDictionary = Record<string, IntlMessageFormat>;
export type IntlMessageFormat = { type: 0 | 1; value: string }[];

export interface IntlMessageDescriptor {
    id: string;
    defaultMessage?: string;
}

export type IntlMessageValues<T> = Record<string, T>;
