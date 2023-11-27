import { IntlAdapter } from '@prezly/theme-kit-nextjs/server';

import { app } from './app';

export const {
    useIntl: intl,
    FormattedMessage,
    FormattedDate,
    FormattedTime,
} = IntlAdapter.connect({
    timezone: () => app().timezone(),
});
