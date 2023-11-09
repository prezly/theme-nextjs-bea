/* eslint-disable @typescript-eslint/no-use-before-define,react/jsx-props-no-spreading */
import type { ReactElement, TimeHTMLAttributes } from 'react';
import { Fragment } from 'react';

import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from './constants';
import type {
    DateFormat,
    IntlDictionary,
    IntlMessageDescriptor,
    IntlMessageValues,
    Iso8601Date,
    TimeFormat,
    UnixTimestampInSeconds,
} from './types';

export function formatMessageString(
    dictionary: IntlDictionary,
    { id, defaultMessage }: IntlMessageDescriptor,
    values: IntlMessageValues<string> = {},
) {
    const format = dictionary[id];

    if (!format) {
        return defaultMessage ?? `[${id}]` ?? '';
    }

    return format
        .map(({ type, value }) => {
            if (type === 1) {
                return values[value] ?? `[${value}]`;
            }

            return value;
        })
        .join('');
}

export function formatMessageFragment(
    dictionary: IntlDictionary,
    { id, defaultMessage }: IntlMessageDescriptor,
    values: IntlMessageValues<string | ReactElement> = {},
): ReactElement {
    const format = dictionary[id];

    if (!format) {
        return <>{defaultMessage ?? `[${id}]` ?? ''}</>;
    }

    return (
        <>
            {format.map(({ type, value }, index) => {
                if (type === 1) {
                    return <Fragment key={index}>{values[value] ?? `[${value}]`}</Fragment>;
                }

                return <Fragment key={index}>{value}</Fragment>;
            })}
        </>
    );
}

type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const MONTH_NAME = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
} as const satisfies Record<Month, string>;

export function formatDate(
    value: Date | Iso8601Date | UnixTimestampInSeconds,
    dateFormat: DateFormat,
) {
    const dateTime = toDate(value);

    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1) as Month;
    const day = dateTime.getDate();

    const monthName = MONTH_NAME[month];

    return replace(dateFormat, {
        [`YYYY`]: year,
        [`YY`]: year % 100,
        [`MM`]: month < 10 ? `0${month}` : `${month}`,
        [`M`]: month,
        [`MMM`]: monthName, // FIXME: Add i18n for these
        [`DD`]: day < 10 ? `0${day}` : `${day}`,
        [`D`]: day,
    });
}

export function formatTime(
    value: Date | Iso8601Date | UnixTimestampInSeconds,
    timeFormat: TimeFormat,
) {
    const dateTime = toDate(value);

    const hours = dateTime.getHours();

    return replace(timeFormat, {
        [`HH`]: hours,
        [`hh`]: hours === 0 ? 12 : hours % 12,
        [`mm`]: dateTime.getMinutes(),
        [`a`]: hours === 0 || hours < 12 ? 'am' : 'pm', // FIXME: Add i18n for these maybe?
    });
}

export function FormattedDate({
    format = DEFAULT_DATE_FORMAT,
    value,
    ...attributes
}: FormattedDate.Props) {
    const dateTime = toDate(value);

    return (
        <time {...attributes} dateTime={dateTime.toISOString()}>
            {formatDate(dateTime, format)}
        </time>
    );
}

export namespace FormattedDate {
    export type Props = {
        value: Date | Iso8601Date | UnixTimestampInSeconds;
        format?: DateFormat;
    } & Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'>;
}

export function FormattedTime({
    format = DEFAULT_TIME_FORMAT,
    value,
    ...attributes
}: FormattedTime.Props) {
    const dateTime = toDate(value);

    return (
        <time {...attributes} dateTime={dateTime.toISOString()}>
            {formatTime(dateTime, format)}
        </time>
    );
}

export namespace FormattedTime {
    export type Props = {
        value: Date | Iso8601Date | UnixTimestampInSeconds;
        format?: TimeFormat;
    } & Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'>;
}

function replace(text: string, replacements: Record<string, string | number>): string {
    return Object.entries(replacements)
        .sort((a, b) => -cmp(a[0].length, b[0].length))
        .reduce(
            (result, [searchValue, replaceValue]) =>
                result.replace(searchValue, String(replaceValue)),
            text,
        );
}

export function toDate(value: Date | Iso8601Date | UnixTimestampInSeconds): Date {
    if (typeof value === 'string') {
        return new Date(value);
    }

    if (typeof value === 'number') {
        return new Date(value * 1000);
    }

    return value;
}

function cmp(a: number, b: number) {
    if (a === b) return 0;
    return a < b ? -1 : 1;
}
