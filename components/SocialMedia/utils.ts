import { NewsroomCompanyInformation } from '@prezly/sdk';

export function hasSocialMedia(companyInformation: NewsroomCompanyInformation): boolean {
    return Boolean(
        companyInformation.facebook ||
            companyInformation.instagram ||
            companyInformation.linkedin ||
            companyInformation.pinterest ||
            companyInformation.tiktok ||
            companyInformation.twitter ||
            companyInformation.youtube,
    );
}
