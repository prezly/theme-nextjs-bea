/* eslint-disable @typescript-eslint/no-use-before-define */
import type { ReactElement } from 'react';
import { Fragment } from 'react';

import type {
    IntlDictionary,
    IntlMessageDescriptor,
    IntlMessageValues,
    Iso8601Date,
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

export function formatDate(date: Date | Iso8601Date, dateFormat: string) {
    // TODO: Add timeZone
    return `[formatDate]: ${date} in ${dateFormat}`; // FIXME
}

export function formatTime(time: Date | Iso8601Date, timeFormat: string) {
    // TODO: Add timeZone
    return `[formatTime]: ${time} in ${timeFormat}`; // FIXME
}

export function formatDateTime(
    dateTime: Date | Iso8601Date,
    dateFormat: string,
    timeFormat: string,
) {
    // TODO: Add timeZone
    return `[formatDateTime] ${dateTime} in ${dateFormat} ${timeFormat}`; // FIXME
}
