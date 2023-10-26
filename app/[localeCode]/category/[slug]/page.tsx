import type { Locale } from '@prezly/theme-kit-intl';

interface Props {
    params: {
        localeCode: Locale.Code;
        slug: string;
    };
}

export default async function CategoryPage({ params }: Props) {
    return (
        <div>
            Category Page for {params.slug} in {params.localeCode}
        </div>
    );
}
