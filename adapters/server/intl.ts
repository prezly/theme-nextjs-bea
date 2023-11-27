import { IntlAdapter } from '@prezly/theme-kit-nextjs/server';

import { app } from './app';
import { getLocaleFromHeaderOptingInForDynamicRenderingWithoutCache } from './locale';

export const {
    useIntl: intl,
    FormattedMessage,
    FormattedDate,
    FormattedTime,
} = IntlAdapter.connect({
    locale: () => getLocaleFromHeaderOptingInForDynamicRenderingWithoutCache(),
    timezone: () => app().timezone(),
});
