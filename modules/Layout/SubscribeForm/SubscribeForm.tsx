import { api } from '@/theme/server';

import * as ui from './ui';

export async function SubscribeForm() {
    const { contentDelivery } = api();

    const newsroom = await contentDelivery.newsroom();

    if (!newsroom.is_subscription_form_enabled) {
        return null;
    }

    return (
        <ui.SubscribeForm
            newsroom={{
                uuid: newsroom.uuid,
                custom_data_request_link: newsroom.custom_data_request_link,
                custom_privacy_policy_link: newsroom.custom_privacy_policy_link,
            }}
        />
    );
}
