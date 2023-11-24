import { MetadataAdapter } from '@prezly/theme-kit-nextjs/server';

import { app } from './app';
import { locale } from './locale';
import { routing } from './routing';

async function resolvableUrlGenerator() {
    const { generateUrl } = await routing();
    return generateUrl;
}

export const {
    mergePageMetadata,
    generateAlternateLanguageLinks,
    generatePageMetadata,
    generateRootMetadata,
    generateStoryPageMetadata,
    generateCategoryPageMetadata,
    generateMediaPageMetadata,
    generateMediaAlbumPageMetadata,
    generateSearchPageMetadata,
} = MetadataAdapter.connect({
    locale,
    newsroom: () => app().newsroom(),
    companyInformation: () => app().companyInformation(),
    languages: () => app().languages(),
    generateUrl: resolvableUrlGenerator,
});
