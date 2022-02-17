import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useEffectOnce, useLatest, usePrevious } from 'react-use';

import { CAMPAIGN } from '../events';
import { useAnalytics } from '../hooks';
import {
    getAssetClickEvent,
    getRecipientInfo,
    getUrlParameters,
    isRecipientIdFormat,
    stripUrlParameters,
} from '../lib';

function Analytics() {
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
        const userId = userRef.current().id();
        const utm = getUrlParameters('utm_');
        const id = utm.get('id');
        const source = utm.get('source');
        const medium = utm.get('medium');

        if (id && source === 'email' && medium === 'campaign') {
            getRecipientInfo(id).then((data) => {
                // re-map current user to the correct identifier
                if (userRef.current().id() === data.recipient_id) {
                    aliasRef.current(data.id, id);
                }

                identifyRef.current(data.id);
                trackRef.current(CAMPAIGN.CLICK, { recipient_id: data.recipient_id }, () =>
                    stripUrlParameters('utm_'),
                );
            });
        } else if (id && isRecipientIdFormat(userId)) {
            getRecipientInfo(userId).then((data) => {
                // re-map current user to the correct identifier
                if (userRef.current().id() === data.recipient_id) {
                    aliasRef.current(data.id, id);
                }

                identifyRef.current(data.id);
            });
        }
    });

    useEffectOnce(() => {
        const asset = getUrlParameters('asset_');
        const id = asset.get('id');
        const type = asset.get('type');

        if (id && type) {
            trackRef.current(getAssetClickEvent(type), { id, type }, () =>
                stripUrlParameters('asset_'),
            );

            // Auto-click assest passed in query parameters (used by campaign links)
            // Pulled from https://github.com/prezly/prezly/blob/9ac32bc15760636ed47eea6fe637d245fa752d32/apps/press/resources/javascripts/prezly.js#L425-L458
            const delay = type === 'image' || type === 'gallery-image' ? 500 : 0;
            window.setTimeout(() => {
                let targetEl = document.getElementById(`${type}-${id}`);
                if (!targetEl) {
                    // Fallback to data-attributes marked element
                    targetEl = document.querySelector(`[data-type='${type}'][data-id='${id}']`);
                }

                if (targetEl) {
                    targetEl.click();
                }
            }, delay);
        }
    });

    return null;
}

export default Analytics;
