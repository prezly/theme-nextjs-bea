import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { DeclareLanguages } from '@/components/DeclareLanguages';
import { generateMediaMetadata } from '@/theme-kit/metadata';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return generateMediaMetadata(params);
}

export default async function MediaPage({ params }: Props) {
    return (
        <>
            <DeclareLanguages routeName="media" />
            <div>Media gallery in {params.localeCode}</div>
        </>
    );
}
