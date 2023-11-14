import { integrateIntl } from '@/theme-kit/server';

import { app } from './app';

export const {
    useIntl: intl,
    FormattedMessage,
    FormattedDate,
    FormattedTime,
} = integrateIntl({
    locale: () => app().locale(),
    timezone: () => app().timezone(),
    dateFormat: () => app().dateFormat(),
    timeFormat: () => app().timeFormat(),
});
