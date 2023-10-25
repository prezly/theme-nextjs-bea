import type { Locale } from '@prezly/theme-kit-intl';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export default async function MediaPage({ params }: Props) {
    return <div>Media gallery in {params.localeCode}</div>;
}
