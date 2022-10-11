import {
    getHomepageStaticProps,
    type HomePageProps,
    useCompanyInformation,
} from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import type {FunctionComponent} from 'react';
import {useIntl} from 'react-intl';

import {Card} from '@/components/TailwindSpotlight/Card';
import {Container} from '@/components/TailwindSpotlight/Container';
import Layout from '@/modules/Layout';
import {importMessages, isTrackingEnabled, loadFeaturedStories} from '@/utils';
import {formatDate} from '@/utils/formatDate';
import type {BasePageProps, StoryWithImage} from 'types';

type Props = BasePageProps & HomePageProps<StoryWithImage>;

interface ArticleProps {
    article: StoryWithImage;
}

function Article({article: story}: ArticleProps) {
    const dateAsString = story.published_at ?? '';
    return (
        <Card>
            <Card.Title href={story.slug}>{story.title}</Card.Title>
            <Card.Eyebrow decorate>{formatDate(dateAsString)}</Card.Eyebrow>
            <Card.Description>{story.summary}</Card.Description>
            <Card.Cta>Read article</Card.Cta>
        </Card>
    );
}

const ArticlePage: FunctionComponent<Props> = ({stories}) => {
    const companyInformation = useCompanyInformation();
    const {formatMessage} = useIntl();

    return (
        <Layout
            title={`${companyInformation.name} - ${formatMessage(translations.newsroom.title)}`}
        >
            <Container className="mt-16 lg:mt-32">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                        Writing on software design, company building, and sometimes my personal life
                    </h1>
                    <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                        All of my long-form thoughts on programming, leadership, product design, and
                        more, collected in chronological order.
                    </p>
                </div>
            </Container>
            <Container className="mt-24 md:mt-28">
                <div
                    className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
                    <div className="flex flex-col gap-16">
                        {stories.map((story) => (
                            <Article key={story.slug} article={story}/>
                        ))}
                    </div>
                </div>
            </Container>
            {/* <Stories stories={stories} pagination={pagination} /> */}
        </Layout>
    );
};

export const getStaticProps = getHomepageStaticProps<BasePageProps, StoryWithImage>(
    async (context, {newsroomContextProps}) => ({
        isTrackingEnabled: isTrackingEnabled(context),
        translations: await importMessages(newsroomContextProps.localeCode),
        featuredStories: await loadFeaturedStories(context),
    }),
);

export default ArticlePage;
