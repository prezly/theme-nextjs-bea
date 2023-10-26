import type { Locale } from '@prezly/theme-kit-intl';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export default async function StoriesIndexPage({ params }: Props) {
    return <div>Stories index in {params.localeCode}</div>;
}
