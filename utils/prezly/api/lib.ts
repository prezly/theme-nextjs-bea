import { NewsroomLanguageSettings } from '@prezly/sdk';

export function getDefaultLanguage(languages: NewsroomLanguageSettings[]) {
    return languages.find(({ is_default }) => is_default) || languages[0];
}

export function getLanguageByLocaleCode(languages: NewsroomLanguageSettings[], localeCode: string) {
    return languages.find(({ code }) => code === localeCode) || getDefaultLanguage(languages);
}

export function getCompanyInformation(languages: NewsroomLanguageSettings[], localeCode: string) {
    const currentLanguage = getLanguageByLocaleCode(languages, localeCode);

    return currentLanguage.company_information;
}
