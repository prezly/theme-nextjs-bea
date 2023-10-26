import type { Locale } from '@prezly/theme-kit-intl';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: string;
    };
}

export default async function AlbumPage({ params }: Props) {
    return <div>Album: {params.uuid}</div>;
}
