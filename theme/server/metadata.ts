import { integrateMetadata } from '@/theme-kit/server';

import { app } from './app';
import { locale } from './locale';

export const {
    mergePageMetadata,
    generateAlternateLanguageLinks,
    generatePageMetadata,
    generateRootMetadata,
    generateStoryPageMetadata,
} = integrateMetadata({
    locale,
    newsroom: () => app().newsroom(),
    companyInformation: () => app().companyInformation(),
    languages: () => app().languages(),
});
