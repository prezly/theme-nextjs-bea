import { headers } from 'next/headers';

export function locale() {
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
