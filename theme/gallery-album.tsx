import type { Culture, NewsroomGallery } from '@prezly/sdk';

import { api } from '@/theme-kit';

interface Match {
    locale: Culture['code'];
    uuid: string;
}

export async function match({ uuid }: Match) {
    const { contentDelivery } = api();

    const gallery = await contentDelivery.gallery(uuid);

    return gallery && { gallery };
}

interface Props {
    gallery: NewsroomGallery;
    locale: Culture['code'];
}

export default function Page({ gallery, locale }: Props) {
    return (
        <div>
            Gallery album #{gallery.uuid} for {locale ?? 'default locale'}
        </div>
    );
}
