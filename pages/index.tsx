import type { NewsroomContact } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { getRedirectToCanonicalLocale, importMessages } from '@/utils';
import { DEFAULT_PAGE_SIZE, getPrezlyApi } from '@/utils/prezly';
import { BasePageProps, PaginationProps, StoryWithImage, Translations } from 'types';

const Stories = dynamic(() => import('@/modules/Stories'), { ssr: true });

interface Props extends BasePageProps {
    contacts: NewsroomContact[];
    stories: StoryWithImage[];
    pagination: PaginationProps;
    translations: Translations;
}

const IndexPage: FunctionComponent<Props> = ({
    stories,
    categories,
    contacts,
    newsroom,
    companyInformation,
    languages,
    localeCode,
    pagination,
    translations,
    themePreset,
    algoliaSettings,
}) => (
    <NewsroomContextProvider
        categories={categories}
        contacts={contacts}
        newsroom={newsroom}
        companyInformation={companyInformation}
        languages={languages}
        localeCode={localeCode}
        translations={translations}
        themePreset={themePreset}
        algoliaSettings={algoliaSettings}
    >
        <Stories stories={stories} pagination={pagination} />
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { req: request, locale, query } = context;
    const api = getPrezlyApi(request);

    const page = query.page && typeof query.page === 'string' ? Number(query.page) : undefined;

    const basePageProps = await api.getBasePageProps(request, locale);
    const { localeResolved } = basePageProps;

    if (!localeResolved) {
        return { notFound: true };
    }

    const redirect = getRedirectToCanonicalLocale(basePageProps, locale, '/', query);
    if (redirect) {
        return { redirect };
    }

    const storiesPaginated = await api.getStories({
        page,
        include: ['thumbnail_image'],
        localeCode: basePageProps.localeCode,
    });

    const contacts = await api.getNewsroomContacts();

    const { stories, storiesTotal } = storiesPaginated;
    const translations = await importMessages(basePageProps.localeCode);

    return {
        props: {
            ...basePageProps,
            // TODO: This is temporary until return types from API are figured out
            stories: stories as StoryWithImage[],
            contacts,
            pagination: {
                itemsTotal: storiesTotal,
                currentPage: page ?? 1,
                pageSize: DEFAULT_PAGE_SIZE,
            },
            translations,
        },
    };
};

export default IndexPage;
