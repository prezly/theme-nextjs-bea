import {
    getHomepageStaticProps,
    type HomePageProps,
    useCompanyInformation,
} from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import classNames from 'classnames';
import Image from 'next/future/image';
import Link from 'next/link';
import type { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

import { Container } from '@/components/TailwindSpotlight/Container';
import { GitHubIcon, LinkedInIcon, TwitterIcon } from '@/components/TailwindSpotlight/SocialIcons';
import Layout from '@/modules/Layout';
import { importMessages, isTrackingEnabled, loadFeaturedStories } from '@/utils';
import image2 from 'public/images/gijs-ball.jpeg';
import image4 from 'public/images/gijs-desk.jpeg';
import image3 from 'public/images/gijs-outlook.jpeg';
import image5 from 'public/images/gijs-ski.jpeg';
import image1 from 'public/images/gijs-zoom.jpeg';
import type { BasePageProps, StoryWithImage } from 'types';

type Props = BasePageProps & HomePageProps<StoryWithImage>;

interface IconTypeProps {
    className: string;
}
type IconType = (props: IconTypeProps) => JSX.Element;

interface SocialLinkProps {
    icon: IconType;
    href: string;
    ariaLabel: string;
}

function SocialLink({ icon: Icon, href, ariaLabel }: SocialLinkProps) {
    return (
        <Link className="group -m-1 p-1" href={href} aria-label={ariaLabel}>
            <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
        </Link>
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

const IndexPage: FunctionComponent<Props> = () => {
    const companyInformation = useCompanyInformation();
    const { formatMessage } = useIntl();

    return (
        <Layout
            title={`${companyInformation.name} - ${formatMessage(translations.newsroom.title)}`}
        >
            <Container className="mt-9">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                        Entrepreneur, father, and software designer.
                    </h1>
                    <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                        I’m Gijs, a software designer and entrepreneur from Belgium. Currently based
                        in 🇪🇸 Spain. I’m the co-founder of Prezly, where we are building tools to
                        make it easy to build fans through great content.
                    </p>
                    <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                        On this page I write about product management, company culture, tech topics
                        and lately sometimes about my personal life.
                    </p>
                    <div className="mt-6 flex gap-6">
                        <SocialLink
                            href="https://twitter.com/digitalbase"
                            ariaLabel="Follow on Twitter"
                            icon={TwitterIcon}
                        />
                        <SocialLink
                            href="https://github.com"
                            ariaLabel="Follow on GitHub"
                            icon={GitHubIcon}
                        />
                        <SocialLink
                            href="https://linkedin.com"
                            ariaLabel="Follow on LinkedIn"
                            icon={LinkedInIcon}
                        />
                    </div>
                </div>
            </Container>
            <Photos />
            <Container className="mt-24 md:mt-28">
                <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
                    <div className="flex flex-col gap-16">
                        test
                        {/* {articles.map((article) => ( */}
                        {/*    <Article key={article.slug} article={article} /> */}
                        {/* ))} */}
                    </div>
                    <div className="space-y-10 lg:pl-16 xl:pl-24">
                        {/* <Newsletter /> */}
                        {/* <Resume /> */}
                    </div>
                </div>
            </Container>
            {/* <Stories stories={stories} pagination={pagination} /> */}
        </Layout>
    );
};

export const getStaticProps = getHomepageStaticProps<BasePageProps, StoryWithImage>(
    async (context, { newsroomContextProps }) => ({
        isTrackingEnabled: isTrackingEnabled(context),
        translations: await importMessages(newsroomContextProps.localeCode),
        featuredStories: await loadFeaturedStories(context),
    }),
    { extraStoryFields: ['thumbnail_image'] },
);

export default IndexPage;
