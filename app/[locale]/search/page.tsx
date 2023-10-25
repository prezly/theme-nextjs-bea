import type { Locale } from '@prezly/theme-kit-intl';

interface Props {
    params: {
        locale: Locale.Code;
    };
}

export default async function SearchPage({ params }: Props) {
    const { locale } = params;
    return <div>Search results page in {locale}</div>;
}
