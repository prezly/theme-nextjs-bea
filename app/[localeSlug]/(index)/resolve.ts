import { handleLocaleSlug, routing } from '@/adapters/server';

type Params = {
    localeSlug: string;
};

export async function resolve({ localeSlug }: Params) {
    const { generateUrl } = await routing();

    const localeCode = await handleLocaleSlug(localeSlug, (localeCode) =>
        generateUrl('index', { localeCode }),
    );

    return { localeCode };
}
