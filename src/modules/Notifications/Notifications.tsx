import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';

import * as ui from './ui';

interface Props {
    localeCode: Locale.Code;
}

export async function Notifications({ localeCode }: Props) {
    const newsroomNotifications = await app().notifications(localeCode);

    return <ui.Notifications notifications={newsroomNotifications} />;
}
