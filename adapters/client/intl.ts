import { IntlAdapter } from '@prezly/theme-kit-nextjs/client';

export const { useIntl, IntlContextProvider, FormattedMessage, FormattedDate, FormattedTime } =
    IntlAdapter.connect();
