import type { Culture } from '@prezly/sdk';
import { cache } from 'react';

import { app } from '@/adapters/server';

export const getNewsroom = cache(() => app().newsroom());

export const getLanguageSettings = cache((localeCode: Culture.Code) =>
    app().languageOrDefault(localeCode),
);
