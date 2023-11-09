import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { DeclareLanguages } from '@/components/DeclareLanguages';
import { Content } from '@/modules/Layout';
import { Stories } from '@/modules/Stories';
import { api } from '@/theme-kit';
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
    const { contentDelivery } = api();
    const languages = await contentDelivery.languages();

    return (
        <Content>
            <DeclareLanguages
                languages={languages.filter((lang) => lang.public_stories_count > 0)}
                routeName="index"
            />
            <Stories pageSize={DEFAULT_PAGE_SIZE} />
        </Content>
    );
}
