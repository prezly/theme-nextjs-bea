import { getLocaleFromHeader } from '@/theme-kit/middleware';

export function locale() {
    return getLocaleFromHeader();
}
