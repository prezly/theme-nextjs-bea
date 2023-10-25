import { headers } from 'next/headers';

export function locale() {
    return headers().get(locale.HEADER);
}

export namespace locale {
    export const HEADER = 'X-Prezly-Locale';
}
