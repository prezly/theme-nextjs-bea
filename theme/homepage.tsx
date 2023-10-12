import type { Culture } from '@prezly/sdk';

import { api } from '@/utils';

interface Match {
    locale: Culture['code'];
}

export default async function Page({ locale }: Match) {
    const { contentDelivery } = api();

    const language = (await contentDelivery.language(locale))!;

    return <div>Homepage for {language.locale.code}</div>;
}
