import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { Content, Header } from '@/modules/Layout';
import { Stories } from '@/modules/Stories';
import { generateHomepageMetadata } from '@/theme-kit/metadata';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export function generateMetadata({ params }: Props): Promise<Metadata> {
    return generateHomepageMetadata({
        localeCode: params.localeCode,
    });
}

export default async function StoriesIndexPage() {
    return (
        <>
            <Header routeName="index" />
            <Content>
                <Stories pageSize={DEFAULT_PAGE_SIZE} />
            </Content>
        </>
    );
}
