import translations from '@prezly/themes-intl-messages';
import { FormattedMessage } from 'react-intl';

import { useCookieConsent } from '../../hooks';

interface Props {
    className?: string;
}

function CookieConsentLink({ className }: Props) {
    const { isTrackingAllowed, supportsCookie, toggle } = useCookieConsent();

    if (!supportsCookie) {
        return null;
    }

    return (
        <button type="button" className={className} onClick={toggle}>
            {isTrackingAllowed ? (
                <FormattedMessage {...translations.actions.stopUsingCookies} />
            ) : (
                <FormattedMessage {...translations.actions.startUsingCookies} />
            )}
        </button>
    );
}

export default CookieConsentLink;
