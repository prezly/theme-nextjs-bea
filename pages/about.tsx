import type { HomePageProps } from '@prezly/theme-kit-nextjs';
import { getHomepageStaticProps } from '@prezly/theme-kit-nextjs';
import Image from 'next/future/image';
import Link from 'next/link';
import type { FunctionComponent } from 'react';

import { Container } from '@/components/TailwindSpotlight/Container';
import SocialLink from '@/components/TailwindSpotlight/Extracted/SocialLink';
import { GitHubIcon, LinkedInIcon, TwitterIcon } from '@/components/TailwindSpotlight/SocialIcons';
import Layout from '@/modules/Layout';
import { importMessages, isTrackingEnabled, loadFeaturedStories } from '@/utils';
import portraitImage from 'public/images/avatar.jpeg';
import type { BasePageProps, StoryWithImage } from 'types';

type Props = BasePageProps & HomePageProps<StoryWithImage>;

const AboutPage: FunctionComponent<Props> = () => (
    <Layout title="About Me">
        <Container className="mt-16 sm:mt-32">
            <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
                <div className="lg:pl-20">
                    <div className="max-w-xs px-2.5 lg:max-w-none">
                        <Image
                            src={portraitImage}
                            alt=""
                            className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
                        />
                    </div>
                </div>
                <div className="lg:order-first lg:row-span-2">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                        Hi. I&apos;m Gijs.
                    </h1>
                    <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
                        <p>
                            So my name is Gijs Nelissen. Recently{' '}
                            <Link href="/moving-to-spain" className="hyperlink">
                                moved to Spain
                            </Link>{' '}
                            after living in Leuven, Belgium for most of my life together with
                            Annelies who I proudly call <i>my wife</i> (although that&apos;s not
                            technically true) and our three kids Marcel, Lucie and Robbert.
                        </p>
                        <p>
                            I spend most of my time between being a parent and as a co-founder of{' '}
                            <Link href="https://www.prezly.com" className="hyperlink">
                                Prezly.com
                            </Link>
                            . At this point that means being involved in most aspects of the company
                            but my focus is primarly on the product/tech side.
                        </p>
                        <p>
                            In the time I have left I spend way too much time in front of my
                            computer, do urban gardening, and I am learning how to become an amateur
                            wood-worker.
                        </p>
                        <p>
                            I use this blog (
                            <Link href="/new-blog-theme" className="hyperlink">
                                switched from Ghost to Next.js
                            </Link>
                            ) to practice my writing skills and share ideas or failures. Topics
                            include product-management, company culture & hiring, tech topics and
                            maybe sometimes about my personal life.
                        </p>

                        <p>Best way to reach me is on Twitter.</p>
                    </div>
                </div>
                <div className="lg:pl-20">
                    <ul role="list">
                        <SocialLink href="https://twitter.com/digitalbase" icon={TwitterIcon}>
                            Follow on Twitter
                        </SocialLink>
                        <SocialLink
                            href="https://www.linkedin.com/in/gijsnelissen/"
                            icon={LinkedInIcon}
                            className="mt-4"
                        >
                            Connect on LinkedIn
                        </SocialLink>
                        <SocialLink
                            href="https://github.com/digitalbase"
                            icon={GitHubIcon}
                            className="mt-4"
                        >
                            Follow on GitHub
                        </SocialLink>
                    </ul>
                </div>
            </div>
        </Container>
    </Layout>
);

export const getStaticProps = getHomepageStaticProps<BasePageProps, StoryWithImage>(
    async (context, { newsroomContextProps }) => ({
        isTrackingEnabled: isTrackingEnabled(context),
        translations: await importMessages(newsroomContextProps.localeCode),
        featuredStories: await loadFeaturedStories(context),
    }),
);

export default AboutPage;
