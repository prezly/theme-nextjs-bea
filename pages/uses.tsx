import type { HomePageProps } from '@prezly/theme-kit-nextjs';
import { getHomepageStaticProps } from '@prezly/theme-kit-nextjs';
import Link from 'next/link';
import type { FunctionComponent, ReactNode } from 'react';

import { Card } from '@/components/TailwindSpotlight/Card';
import { Container } from '@/components/TailwindSpotlight/Container';
import { Section } from '@/components/TailwindSpotlight/Section';
import Layout from '@/modules/Layout';
import { importMessages, isTrackingEnabled, loadFeaturedStories } from '@/utils';
import type { BasePageProps, StoryWithImage } from 'types';

type Props = BasePageProps & HomePageProps<StoryWithImage>;

interface ToolSectionProps {
    title: string;
    children: ReactNode;
}

function ToolsSection({ children, ...props }: ToolSectionProps) {
    return (
        <Section {...props}>
            <ul role="list" className="space-y-16">
                {children}
            </ul>
        </Section>
    );
}

interface ToolProps {
    title: string;
    href?: string;
    children: ReactNode;
}

function Tool({ title, href, children }: ToolProps) {
    return (
        <Card>
            <Card.Title href={href ?? ''}>{title}</Card.Title>
            <Card.Description>{children}</Card.Description>
        </Card>
    );
}

const UsesPage: FunctionComponent<Props> = () => (
    <Layout title="Uses.tech">
        <Container className="mt-16 sm:mt-32">
            <header className="max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                    Software I use, my workstation, and other things I recommend.
                </h1>
                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                    This page is an overview off all the things I use to build software, stay
                    productive, or buy to fool myself into thinking I’m being productive when I’m
                    really just procrastinating.
                </p>
                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                    It is inspired by{' '}
                    <Link href="https://uses.tech/" className="hyperlink">
                        uses.tech
                    </Link>{' '}
                    which is a directory (made by{' '}
                    <Link href="https://wesbos.com/uses" className="hyperlink">
                        @wesbos
                    </Link>
                    ) of people sharing specifics about the hardware/software they use.
                </p>
            </header>
            <div className="mt-16 sm:mt-20">
                <div className="space-y-20">
                    <ToolsSection title="Workstation">
                        <Tool title="14” MacBook Pro, M1 Max, 32GB RAM (2021)">
                            I was using an Intel-based 15” MacBook Pro prior to this and the
                            difference is night and day. I’ve never heard the fans turn on a single
                            time, the battery time is amazing.
                        </Tool>
                        <Tool title="Dell U3821DW">
                            This is a 38 inch UltraSharp Curved USB-C Hub monitor with built in KVM.
                            It's running at WQHD+ 3840x1600 at 60Hz. It's mounted on a Ergotron HX
                            mount (VESA) which makes it super easy to move.
                        </Tool>
                        <Tool title="Herman Miller Aeron Chair">
                            If I’m going to slouch in the worst ergonomic position imaginable all
                            day, I might as well do it in an expensive chair.
                        </Tool>
                        <Tool title="Jean Prouve compas direction desk">
                            It's a pretty small desk (60x140cm) but it looks great. The wood top is
                            made from oak with a natural finish and feels great. No mouse-pad
                        </Tool>
                        <Tool title="Apple Magic Keyboard">
                            I'm using a dark version with a Numeric Keybpad but without Touch ID
                        </Tool>
                        <Tool title="Logitech MX Master 2">
                            Favourite mouse although I'm carrying a Logitech everyday in my laptop
                            bag.
                        </Tool>
                        <Tool title="Logitech C920">
                            As the laptop is almost always closed I need an external camera. This
                            camera can do Full HD video (1080p at 30fps). I'm considering{' '}
                            <Link
                                href="https://ma.tt/2020/05/ceo-video-streaming/"
                                className="hyperlink"
                            >
                                upgrading my video setup
                            </Link>{' '}
                            at some point.
                        </Tool>
                    </ToolsSection>
                    <ToolsSection title="Development tools">
                        <Tool title="PhpStorm">
                            I never jumped on the VSCode bandwagon although the majority of the work
                            I do now is Typescript/JS stuff. After years of using this IDE I come to
                            know it inside out.
                            <br />
                            <br />
                            Within PHPStorm I use Material Oceanic theme, the Git and Database
                            integrations and lately I've been trying to use the terminal window so I
                            don't have to Alt-TAB while in focus mode.
                        </Tool>
                        <Tool title="iTerm2">
                            I’m honestly not even sure what features I get with this that aren’t
                            just part of the macOS Terminal but it’s what I use.
                        </Tool>

                        <Tool title="Linear">
                            Since we switched to Linear we haven't looked back. We tried Asana,
                            Clubhouse, Trello, Jira, and every other Project Management on the
                            planet including self hosting Redmine. Linear is simple, fast,
                            beautifully designed and has offline syncing. And it has the right
                            amount of features!
                        </Tool>
                    </ToolsSection>
                    <ToolsSection title="Productivity">
                        <Tool title="BetterTouchTool">
                            This tool is so awesome and the first thing I install on a new machine.
                            It pretty much replaces 3 or 4 tools I was using before.
                            <br />
                            <br />
                            Since{' '}
                            <Link
                                href="https://updates.folivora.ai/bettertouchtool_release_notes.html"
                                className="hyperlink"
                            >
                                they started supporting the Hyper key
                            </Link>{' '}
                            I was able to also throw out Karabiner too. I use it for window
                            management shortcuts, quick access to apps, setting defaults based on
                            location and much more.
                            <br />
                            <br />
                            Another neat trick is using BTT is to open links in the right app. This
                            can be done by by setting BTT as the default browser and using URL
                            inspection to launch the right app with Javascript.{' '}
                            <Link
                                href="/mac-opening-notionlinear-links-in-the-right-app"
                                className="hyperlink"
                            >
                                Wrote about it here
                            </Link>
                        </Tool>
                        <Tool title="Brew">
                            Most of the tools I install are automated using Brew and Brew Cask. I
                            keep some shell scripts around and sync them to GitHub so I don't
                            forget. It could/should have more maintenance though.
                        </Tool>
                        <Tool title="Alfred">
                            It’s not the newest kid on the block but I have so many custom workflows
                            that work for me.
                            <br />
                            <br />
                            The most used are going to a website and autofill credentials
                            (1Password) and doing searches on Github, DuckDuckGo, Twitter or Stack
                            Overflow.
                            <br />
                            <br />
                            Additionally I have some custom workflows like focus mode (turn off
                            sounds, notifications, distracting apps) or tiling/positioning different
                            windows based on some presets (development, customer support, Formula
                            1).
                        </Tool>
                        <Tool title="UpNote">
                            After using Bear.app for a few years I switched to Upnote mainly because
                            of Mobile Device syncing. I need my notes to be available offline on an
                            Android device. Since I'm using it I notice how much better organised my
                            notes are in the different collections.
                            <br />
                            <br />
                            Also, I personally think Bear.app is overdoing it with the Markdown
                            stuff :-)
                        </Tool>
                        <Tool title="Notion">
                            As a Company we use Notion as our internal knowledge base. It has a Team
                            directory, and is a write-up of pretty much how the company works.
                            <br />
                            <br />
                            Because the company pitches are written in Notion (
                            <Link href="/multiple-product-teams" className="hyperlink">
                                we started with the Shape-Up method a few months back
                            </Link>
                            ) I find myself spending at least 30% of my time in notion.
                        </Tool>
                    </ToolsSection>
                </div>
            </div>
            <footer className="max-w-2xl mt-16">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl">
                    Prezly tools & resources.
                </h2>
                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                    At my company we're trying to use our own platform for internal and external
                    communication. I published a post about '
                    <Link href="/how-prezly-uses-prezly-to-run-prezly" className="hyperlink">
                        How Prezly uses Prezly to run Prezly
                    </Link>
                    ' a year ago.
                </p>
                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                    Additionally we're using a ton of other tools to support out work. I wrote a
                    reddit post '
                    <Link
                        href="https://www.reddit.com/r/SaaS/comments/o19xcj/the_cost_to_run_my_saas/"
                        className="hyperlink"
                    >
                        The cost to run my SaaS
                    </Link>
                    ' a while back on the different tools we use and the cost of each. The post
                    ended up being the all-time /r/SaaS most favourite post 💯 so I ended up{' '}
                    <Link
                        href="/the-cost-to-run-a-saas-with-a-few-million--arr"
                        className="hyperlink"
                    >
                        posting it on the blog too
                    </Link>
                    .
                </p>
            </footer>
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

export default UsesPage;
