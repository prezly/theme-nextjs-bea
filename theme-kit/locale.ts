import type { Locale } from '@prezly/theme-kit-intl';
import { headers } from 'next/headers';

export function locale(): Locale.Code {
    const code = headers().get(locale.HEADER);

    if (!code) {
        console.error(
            'Locale header is not set. Please check if the middleware is configured properly.',
        );
        return 'en';
    }

    return code;
}

export namespace locale {
    export const HEADER = 'X-Prezly-Locale';
}
