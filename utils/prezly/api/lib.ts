import { NewsroomLanguageSettings } from '@prezly/sdk';

import { convertToBrowserFormat } from '@/utils/localeTransform';

export function getDefaultLanguage(newsroomLanguages: NewsroomLanguageSettings[]) {
    return newsroomLanguages.find(({ is_default }) => is_default) || newsroomLanguages[0];
}

export function getLanguageByLocale(
    newsroomLanguages: NewsroomLanguageSettings[],
    currentLocale: string,
) {
    return (
        newsroomLanguages.find(
            ({ locale }) => convertToBrowserFormat(locale.locale) === currentLocale,
        ) || getDefaultLanguage(newsroomLanguages)
    );
}

export function getCompanyInformation(
    newsroomLanguages: NewsroomLanguageSettings[],
    currentLocale: string,
) {
    const currentLanguage = getLanguageByLocale(newsroomLanguages, currentLocale);

    return currentLanguage.company_information;
}
