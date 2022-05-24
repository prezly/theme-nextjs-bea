import { getDataRequestLink, useCurrentLocale, useNewsroom } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import { FormattedMessage } from 'react-intl';

interface Props {
    className?: string;
}

export function DataRequestLink({ className }: Props) {
    const newsroom = useNewsroom();
    const currentLocale = useCurrentLocale();

    const href = getDataRequestLink(newsroom, currentLocale);

    return (
        <a href={href} className={className}>
            <FormattedMessage {...translations.actions.privacyRequests} />
        </a>
    );
}
