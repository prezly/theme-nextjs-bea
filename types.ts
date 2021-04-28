import { Category, Newsroom, NewsroomCompanyInformation } from '@prezly/sdk/dist/types';

export interface Env {
    NODE_ENV: 'production' | 'development' | 'test';
    PREZLY_ACCESS_TOKEN: string;
    PREZLY_NEWSROOM_UUID: string;
}

export interface BasePageProps {
    newsroom: Newsroom;
    companyInformation: NewsroomCompanyInformation;
    categories: Category[];
}
