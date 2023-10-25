import type { Locale } from '@prezly/theme-kit-intl';

interface Props {
    params: {
        locale: Locale.Code;
    };
}

export default async function StoriesIndexPage({ params }: Props) {
    const { locale } = params;
    return <div>Stories index in {locale}</div>;
}
