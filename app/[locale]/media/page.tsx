import type { Locale } from '@prezly/theme-kit-intl';

interface Props {
    params: {
        locale: Locale.Code;
    };
}

export default async function MediaPage({ params }: Props) {
    return <div>Media gallery in {params.locale}</div>;
}
