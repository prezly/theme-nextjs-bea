import { locale } from '@/theme-kit/locale';
import { integrateIntl } from '@/theme-kit/server';

import { api } from './api';

export const {
    useIntl: intl,
    FormattedMessage,
    FormattedDate,
    FormattedTime,
} = integrateIntl({
    locale: () => locale().code,
    timezone: () =>
        api()
            .contentDelivery.newsroom()
            .then((n) => n.timezone),
    dateFormat: () =>
        api()
            .contentDelivery.newsroom()
            .then((n) => n.date_format),
    timeFormat: () =>
        api()
            .contentDelivery.newsroom()
            .then((n) => n.time_format),
});
