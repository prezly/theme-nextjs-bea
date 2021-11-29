import translations from '@prezly/themes-intl-messages';
import React, { FunctionComponent, MouseEventHandler } from 'react';
import { FormattedMessage } from 'react-intl';

import { useCookieConsent } from '@/hooks';

interface Props {
    className?: string;
}

const CookieConsentLink: FunctionComponent<Props> = ({ className }) => {
    const { isTrackingAllowed, supportsCookie, toggle } = useCookieConsent();

    const handleToggleConsent: MouseEventHandler = (event) => {
        event.preventDefault();
        toggle();
    };

    if (!supportsCookie) {
        return null;
    }

    return (
        <a href="#" className={className} onClick={handleToggleConsent}>
            {isTrackingAllowed ? (
                <FormattedMessage {...translations.actions.stopUsingCookies} />
            ) : (
                <FormattedMessage {...translations.actions.startUsingCookies} />
            )}
        </a>
    );
};

export default CookieConsentLink;
