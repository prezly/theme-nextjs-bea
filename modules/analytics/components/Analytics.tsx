import { useRouter } from 'next/router';
import { FunctionComponent, useEffect } from 'react';
import { useEffectOnce, useLatest, usePrevious } from 'react-use';

import { CAMPAIGN } from '../events';
import { useAnalytics } from '../hooks';
import { getRecipientInfo, isRecipientIdFormat, stripUtmParameters } from '../lib';

const Analytics: FunctionComponent = () => {
    const { alias, identify, page, track, user } = useAnalytics();
    const aliasRef = useLatest(alias);
    const identifyRef = useLatest(identify);
    const trackRef = useLatest(track);
    const userRef = useLatest(user);
    const { asPath: currentPath } = useRouter();
    const previousPath = usePrevious(currentPath);

    useEffect(() => {
        if (currentPath !== previousPath) {
            page();
        }
    }, [currentPath, page, previousPath]);

    useEffectOnce(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const utm = new Map();
        const userId = user().id();

        searchParams.forEach((value, name) => {
            if (name.startsWith('utm_')) {
                utm.set(name.replace('utm_', ''), value);
            }
        });

        if (utm.has('id') && utm.get('source') === 'email' && utm.get('medium') === 'campaign') {
            getRecipientInfo(utm.get('id')).then((data) => {
                // re-map current user to the correct identifier
                if (userRef.current().id() === data.recipient_id) {
                    aliasRef.current(data.id, utm.get('id'));
                }

                identifyRef.current(data.id);
                trackRef.current(
                    CAMPAIGN.CLICK,
                    { recipient_id: data.recipient_id },
                    stripUtmParameters,
                );
            });
        } else if (isRecipientIdFormat(userId)) {
            getRecipientInfo(userId).then((data) => {
                // re-map current user to the correct identifier
                if (userRef.current().id() === data.recipient_id) {
                    aliasRef.current(data.id, utm.get('id'));
                }

                identifyRef.current(data.id);
            });
        }
    });

    return null;
};

export default Analytics;
