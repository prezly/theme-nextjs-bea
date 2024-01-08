import { MetadataAdapter } from '@prezly/theme-kit-nextjs/server';

import { app } from './app';
import { routing } from './routing';

async function resolvableUrlGenerator() {
    const { generateAbsoluteUrl } = await routing();
    return generateAbsoluteUrl;
}

export const {
    mergePageMetadata,
    generateAlternateLanguageLinks,
    generatePageMetadata,
    generateRootMetadata,
    generateStoryPageMetadata,
    generateCategoryPageMetadata,
    generateMediaPageMetadata,
    generateMediaGalleryPageMetadata,
    generateSearchPageMetadata,
} = MetadataAdapter.connect({
    newsroom: () => app().newsroom(),
    companyInformation: () => app().companyInformation(),
    languages: () => app().languages(),
    generateUrl: resolvableUrlGenerator,
});
