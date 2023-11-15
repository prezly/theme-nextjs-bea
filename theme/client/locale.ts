import type { Locale } from '@prezly/theme-kit-nextjs';

import { useIntl } from './intl';

export function useLocale(): Locale.Code {
    return useIntl().locale;
}
