import type { Locale } from '@prezly/theme-kit-intl';
import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { Header } from '@/modules/Header';
import { Content } from '@/modules/Layout';
import { Stories } from '@/modules/Stories';
import { generatePageMetadata, routing } from '@/theme/server';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export async function generateMetadata(_: Props): Promise<Metadata> {
    const { generateUrl } = await routing();

    return generatePageMetadata({
        generateUrl: (localeCode) => generateUrl('index', { localeCode }),
    });
}

export default async function StoriesIndexPage(_: Props) {
    return (
        <>
            <Header routeName="index" />
            <Content>
                <Stories pageSize={DEFAULT_PAGE_SIZE} />
            </Content>
        </>
    );
}
