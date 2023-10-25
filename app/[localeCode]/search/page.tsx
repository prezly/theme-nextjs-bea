import type { Locale } from '@prezly/theme-kit-intl';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export default async function SearchPage({ params }: Props) {
    return <div>Search results page in {params.localeCode}</div>;
}
