import { Category, Newsroom, NewsroomCompanyInformation } from '@prezly/sdk/dist/types';
import { FormikErrors, FormikHelpers } from 'formik';

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

export interface PaginationProps {
    itemsTotal: number;
    currentPage: number;
    pageSize: number;
}

export type FormSubmitHandler<T extends Object> = (
    values: T,
    formikHelpers: FormikHelpers<T>,
) => void | Promise<void>;

export type FormValidator<T extends Object> = (
    values: T,
) => void | object | Promise<FormikErrors<T>>;
