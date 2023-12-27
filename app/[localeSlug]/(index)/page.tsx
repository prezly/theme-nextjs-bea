import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { generatePageMetadata, routing } from '@/adapters/server';
import { Stories } from '@/modules/Stories';
import { resolve } from './resolve';

interface Props {
    params: {
        localeSlug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { generateUrl } = await routing();

    const { localeCode } = await resolve(params);

    return generatePageMetadata({
        locale: localeCode,
        generateUrl: (localeCode) => generateUrl('index', { localeCode }),
    });
}

export default async function StoriesIndexPage({ params }: Props) {
    const { localeCode } = await resolve(params);

    return <Stories localeCode={localeCode} pageSize={DEFAULT_PAGE_SIZE} />;
}
