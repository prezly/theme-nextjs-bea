import { app, getLocaleSlugFromHeader, matchLocaleSlug } from '@/adapters/server';
import { NotFound } from '@/modules/NotFound';

export default async function NotFoundPage() {
    async function detectLocale() {
        const localeSlug = getLocaleSlugFromHeader();

        if (localeSlug) {
            return matchLocaleSlug(localeSlug);
        }

        return undefined;
    }

    const localeCode = (await detectLocale()) ?? (await app().defaultLocale());

    return <NotFound localeCode={localeCode} />;
}