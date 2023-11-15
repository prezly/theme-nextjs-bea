import { IntlAdapter } from '@prezly/theme-kit-nextjs/adapters/client';

export const { useIntl, IntlContextProvider, FormattedMessage, FormattedDate, FormattedTime } =
    IntlAdapter.connect();
