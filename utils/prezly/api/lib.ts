import { NewsroomLanguageSettings } from '@prezly/sdk';

export function getDefaultLanguage(languages: NewsroomLanguageSettings[]) {
    return languages.find(({ is_default }) => is_default) || languages[0];
}

export function getLanguageByLocale(languages: NewsroomLanguageSettings[], currentLocale: string) {
    return languages.find(({ code }) => code === currentLocale) || getDefaultLanguage(languages);
}

export function getCompanyInformation(
    languages: NewsroomLanguageSettings[],
    currentLocale: string,
) {
    const currentLanguage = getLanguageByLocale(languages, currentLocale);

    return currentLanguage.company_information;
}
