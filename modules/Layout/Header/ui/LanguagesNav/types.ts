import type { Locale } from '@prezly/theme-kit-intl';

export interface LanguageDisplayProps {
    code: Locale.Code;
    title: string;
    href: string;
}
