import type { Locale } from '@prezly/theme-kit-intl';

import { useIntl } from './intl';

export function useLocale(): Locale.Code {
    return useIntl().locale;
}
