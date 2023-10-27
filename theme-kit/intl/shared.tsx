/* eslint-disable @typescript-eslint/no-use-before-define */
import type { ReactElement } from 'react';

import type { IntlDictionary, IntlMessageDescriptor, IntlMessageValues } from './types';

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
            {format.map(({ type, value }) => {
                if (type === 1) {
                    return values[value] ?? `[${value}]`;
                }

                return value;
            })}
        </>
    );
}
