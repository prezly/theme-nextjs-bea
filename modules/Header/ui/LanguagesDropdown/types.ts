import type { Locale } from '@prezly/theme-kit-nextjs';

export interface LanguageOption {
    code: Locale.Code;
    title: string;
    href: string;
}
