import { IntlAdapter } from '@prezly/theme-kit-nextjs/server';

import { app } from './app';

export const {
    useIntl: intl,
    FormattedMessage,
    FormattedDate,
    FormattedTime,
} = IntlAdapter.connect({
    locale: () => app().locale(),
    timezone: () => app().timezone(),
    dateFormat: () => app().dateFormat(),
    timeFormat: () => app().timeFormat(),
});
