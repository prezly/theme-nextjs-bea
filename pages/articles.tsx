import {
    getHomepageStaticProps,
    type HomePageProps,
    useCompanyInformation,
} from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import classNames from 'classnames';
import Image from 'next/future/image';
import Link from 'next/link';
import type {FunctionComponent} from 'react';
import {useIntl} from 'react-intl';

import {Button} from '@/components/TailwindSpotlight/Button';
import {Card} from '@/components/TailwindSpotlight/Card';
import {Container} from '@/components/TailwindSpotlight/Container';
import SocialLink from '@/components/TailwindSpotlight/Extracted/SocialLink';
import {GitHubIcon, LinkedInIcon, TwitterIcon} from '@/components/TailwindSpotlight/SocialIcons';
import Layout from '@/modules/Layout';
import {importMessages, isTrackingEnabled, loadFeaturedStories} from '@/utils';
import {formatDate} from '@/utils/formatDate';
import image2 from 'public/images/gijs-ball.jpeg';
import image4 from 'public/images/gijs-desk.jpeg';
import image3 from 'public/images/gijs-outlook.jpeg';
import image5 from 'public/images/gijs-ski.jpeg';
import image1 from 'public/images/gijs-zoom.jpeg';
import type {BasePageProps, StoryWithImage} from 'types';

type Props = BasePageProps & HomePageProps<StoryWithImage>;

interface IconTypeProps {
    className: string;
}

interface ArticleProps {
    article: StoryWithImage;
}

function MailIcon({className}: IconTypeProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={className}
        >
            <path
                d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
                className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
            />
            <path
                d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
                className="stroke-zinc-400 dark:stroke-zinc-500"
            />
        </svg>
    );
}

function Newsletter() {
    return (
        <form
            action="/thank-you"
            className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
        >
            <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                <MailIcon className="h-6 w-6 flex-none"/>
                <span className="ml-3">Stay up to date</span>
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Get notified when I publish something new, and unsubscribe at any time.
            </p>
            <div className="mt-6 flex">
                <input
                    type="email"
                    placeholder="Email address"
                    aria-label="Email address"
                    required
                    className="flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-rose-400 dark:focus:ring-rose-400/10 sm:text-sm"
                />
                <Button buttonType="submit" className="ml-4 flex-none">
                    Join
                </Button>
            </div>
        </form>
    );
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

function Photos() {
    const rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2'];

    return (
        <div className="mt-16 sm:mt-20">
            <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
                {[image1, image2, image3, image4, image5].map((image, imageIndex) => (
                    <div
                        key={image.src}
                        className={classNames(
                            'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl',
                            rotations[imageIndex % rotations.length],
                        )}
                    >
                        <Image
                            src={image}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
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
