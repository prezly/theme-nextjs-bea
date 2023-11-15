import { MetadataAdapter } from '@prezly/theme-kit-nextjs/server';

import { app } from './app';
import { locale } from './locale';

export const {
    mergePageMetadata,
    generateAlternateLanguageLinks,
    generatePageMetadata,
    generateRootMetadata,
    generateStoryPageMetadata,
} = MetadataAdapter.connect({
    locale,
    newsroom: () => app().newsroom(),
    companyInformation: () => app().companyInformation(),
    languages: () => app().languages(),
});
