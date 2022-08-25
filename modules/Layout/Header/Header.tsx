/* This example requires Tailwind CSS v2.0+ */
import { Popover, Transition } from '@headlessui/react';
import {
    BeakerIcon,
    ChartBarIcon,
    ChatIcon,
    CodeIcon,
    DesktopComputerIcon,
    MenuIcon,
    NewspaperIcon,
    ScaleIcon,
    SparklesIcon,
    UserIcon,
    XIcon,
} from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { IconClose, IconSearch } from '@prezly/icons';
import {
    useAlgoliaSettings,
    useCompanyInformation,
    useGetLinkLocaleSlug,
    useNewsroom,
} from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import { Button } from '@prezly/themes-ui-components';
import Image, { UploadcareImage } from '@prezly/uploadcare-image';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Fragment, type MouseEvent, useState } from 'react';
import { useIntl } from 'react-intl';

import { getStoryThumbnail } from '@/components/StoryImage/lib';
import { ThemeSelector } from '@/components/ThemeSelector/ThemeSelector';
import { useFeaturedStories } from '@/contexts/featuredStories';
import { useDevice } from '@/hooks';

import styles from './Header.module.scss';

const SearchWidget = dynamic(() => import('./SearchWidget'), { ssr: false });

const categories = [
    {
        name: 'Product Management',
        description: 'Anything about product prioritisation and Product Management',
        href: '/category/product-management',
        icon: ScaleIcon,
    },
    {
        name: 'Marketing Attribution',
        description:
            'A series of blog posts about solving marketing attribution using Segment.com some good ol Lambda.',
        href: '/category/solving-marketing-attribution',
        icon: ChartBarIcon,
    },
    {
        name: 'The Best Newsroom',
        description: "For an upcoming Prezly project we're rethinking the newsroom part of Prezly.",
        href: '/category/the-best-newsroom',
        icon: SparklesIcon,
    },
    {
        name: 'Personal ',
        description:
            "Stuff about my family, hobbies. Here you'll find stuff that is not technical.",
        href: '/category/lifelog',
        icon: UserIcon,
    },
];

const resources = [
    { name: 'About Me', href: '/about', icon: UserIcon },
    { name: 'How I built this blog', href: '/new-blog-theme', icon: BeakerIcon },
    { name: 'Uses.Tech', href: '/uses', icon: DesktopComputerIcon },
    { name: 'All Articles', href: '/search', icon: NewspaperIcon },
    {
        name: 'Codebase (github)',
        href: 'https://github.com/digitalbase/lifelog-nextjs',
        icon: CodeIcon,
    },
    { name: 'Contact Me', href: 'https://www.twitter.com/digitalbase', icon: ChatIcon },
];

export default function Header() {
    const { newsroom_logo, display_name, square_logo } = useNewsroom();
    const { name } = useCompanyInformation();
    const { ALGOLIA_API_KEY } = useAlgoliaSettings();
    const getLinkLocaleSlug = useGetLinkLocaleSlug();
    const { isMobile } = useDevice();
    const { formatMessage } = useIntl();
    const [isSearchWidgetShown, setIsSearchWidgetShown] = useState(false);
    const [isMenuOpen] = useState(false);
    const newsroomName = name || display_name;
    const IS_SEARCH_ENABLED = Boolean(ALGOLIA_API_KEY);
    const featuredStories = useFeaturedStories();

    function toggleSearchWidget(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        // alignMobileHeader();

        // Adding a timeout to update the state only after the scrolling is triggered.
        setTimeout(() => setIsSearchWidgetShown((o) => !o));
    }
    function closeSearchWidget() {
        return setIsSearchWidgetShown(false);
    }

    return (
        <Popover className="relative">
            <div className="absolute inset-0 shadow z-[3] pointer-events-none" aria-hidden="true" />
            <div className="relative z-[2]">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-5 sm:px-6 sm:py-4 lg:px-8 md:justify-start md:space-x-10">
                    <div>
                        <Link href="/">
                            <a className="flex">
                                <span className="sr-only">Workflow</span>
                                {newsroom_logo ? (
                                    <Image
                                        layout="fill"
                                        objectFit="contain"
                                        imageDetails={newsroom_logo}
                                        alt={newsroomName}
                                        className="h-8 w-auto sm:h-10 dark:invert"
                                    />
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        className="h-8 w-auto sm:h-10"
                                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                        alt=""
                                    />
                                )}
                            </a>
                        </Link>
                    </div>
                    <div className="-mr-2 -my-2 md:hidden">
                        <Popover.Button className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Open menu</span>
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                    </div>
                    <div className="hidden md:flex-1 md:flex md:items-center md:justify-center">
                        <Popover.Group as="nav" className="flex space-x-10">
                            <Popover>
                                {({ open }) => (
                                    <>
                                        <Popover.Button
                                            className={classNames(
                                                open ? 'text-gray-900' : 'text-gray-800',
                                                'dark:text-white group rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                                            )}
                                        >
                                            <span>Stuff I write about</span>
                                            <ChevronDownIcon
                                                className={classNames(
                                                    open ? 'text-rose-500' : 'text-gray-400',
                                                    'ml-2 h-5 w-5 group-hover:text-rose-500 dark:text-white',
                                                )}
                                                aria-hidden="true"
                                            />
                                        </Popover.Button>

                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="opacity-0 -translate-y-1"
                                            enterTo="opacity-100 translate-y-0"
                                            leave="transition ease-in duration-150"
                                            leaveFrom="opacity-100 translate-y-0"
                                            leaveTo="opacity-0 -translate-y-1"
                                        >
                                            <Popover.Panel className="hidden md:block absolute z-[1] top-full inset-x-0 transform shadow-lg bg-white dark:bg-gray-800">
                                                <div className="max-w-7xl mx-auto grid gap-y-6 px-4 py-6 sm:grid-cols-2 sm:gap-8 sm:px-6 sm:py-8 lg:grid-cols-4 lg:px-8 lg:py-8 xl:py-12">
                                                    {categories.map((item) => (
                                                        <Link key={item.name} href={item.href}>
                                                            <a className="-m-3 p-3 flex flex-col justify-between rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                                                <div className="flex md:h-full lg:flex-col">
                                                                    <div className="flex-shrink-0">
                                                                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-rose-600 text-white sm:h-12 sm:w-12">
                                                                            <item.icon
                                                                                className="h-6 w-6"
                                                                                aria-hidden="true"
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                    <div className="ml-4 md:flex-1 md:flex md:flex-col md:justify-between lg:ml-0 lg:mt-4">
                                                                        <div>
                                                                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                                                                {item.name}
                                                                            </p>
                                                                            <p className="mt-1 text-sm text-gray-800 dark:text-white">
                                                                                {item.description}
                                                                            </p>
                                                                        </div>
                                                                        <p className="mt-2 text-sm font-medium text-rose-700 hover:text-rose-500 dark:text-rose-500 lg:mt-4">
                                                                            Read articles{' '}
                                                                            <span aria-hidden="true">
                                                                                &rarr;
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </Popover.Panel>
                                        </Transition>
                                    </>
                                )}
                            </Popover>
                            <Link href="/about">
                                <a className="text-base font-medium text-gray-800 dark:text-white hover:text-gray-900">
                                    About me
                                </a>
                            </Link>
                            <Popover>
                                {({ open }) => (
                                    <>
                                        <Popover.Button
                                            className={classNames(
                                                open ? 'text-gray-900' : 'text-gray-800',
                                                'dark:text-white group rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                                            )}
                                        >
                                            <span>The Blog</span>
                                            <ChevronDownIcon
                                                className={classNames(
                                                    open ? 'text-rose-500' : 'text-gray-400',
                                                    'ml-2 h-5 w-5 group-hover:text-rose-500 dark:text-white',
                                                )}
                                                aria-hidden="true"
                                            />
                                        </Popover.Button>

                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="opacity-0 -translate-y-1"
                                            enterTo="opacity-100 translate-y-0"
                                            leave="transition ease-in duration-150"
                                            leaveFrom="opacity-100 translate-y-0"
                                            leaveTo="opacity-0 -translate-y-1"
                                        >
                                            <Popover.Panel className="hidden md:block absolute z-10 top-full inset-x-0 transform shadow-lg bg-white dark:bg-gray-800">
                                                <div className="absolute inset-0 flex">
                                                    <div className="bg-white dark:bg-gray-800 w-1/2" />
                                                    <div className="bg-gray-50 dark:bg-gray-700 w-1/2" />
                                                </div>
                                                <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
                                                    <nav className="grid gap-y-10 px-4 py-8 bg-white dark:bg-gray-800 sm:grid-cols-2 sm:gap-x-8 sm:py-12 sm:px-6 lg:px-8 xl:pr-12">
                                                        <div>
                                                            <h3 className="text-sm font-medium tracking-wide text-gray-800 uppercase dark:text-white">
                                                                Resources
                                                            </h3>
                                                            <ul
                                                                role="list"
                                                                className="mt-5 space-y-6"
                                                            >
                                                                {resources.map((item) => (
                                                                    <li
                                                                        key={item.name}
                                                                        className="flow-root"
                                                                    >
                                                                        <Link href={item.href}>
                                                                            <a className="-m-3 p-3 flex items-center rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white">
                                                                                <item.icon
                                                                                    className="flex-shrink-0 h-6 w-6 text-gray-400"
                                                                                    aria-hidden="true"
                                                                                />
                                                                                <span className="ml-4">
                                                                                    {item.name}
                                                                                </span>
                                                                            </a>
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </nav>
                                                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-8 sm:py-12 sm:px-6 lg:px-8 xl:pl-12">
                                                        <div>
                                                            <h3 className="text-sm font-medium tracking-wide text-gray-800 uppercase dark:text-white">
                                                                From the blog
                                                            </h3>
                                                            <ul
                                                                role="list"
                                                                className="mt-6 space-y-6"
                                                            >
                                                                {featuredStories.map((story) => (
                                                                    <li
                                                                        key={story.uuid}
                                                                        className="flow-root"
                                                                    >
                                                                        <a
                                                                            href={`/${story.slug}`}
                                                                            className="-m-3 p-3 flex rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                                                        >
                                                                            <div className="hidden sm:block flex-shrink-0 w-32 h-20 relative">
                                                                                {story.thumbnail_image && (
                                                                                    <UploadcareImage
                                                                                        imageDetails={
                                                                                            getStoryThumbnail(
                                                                                                story,
                                                                                            )!
                                                                                        }
                                                                                        layout="fill"
                                                                                        objectFit="cover"
                                                                                        alt={
                                                                                            story.title
                                                                                        }
                                                                                        containerClassName="rounded-md overflow-hidden"
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                            <div className="w-0 flex-1 sm:ml-8">
                                                                                <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
                                                                                    {story.title}
                                                                                </h4>
                                                                                <p className="mt-1 text-sm text-gray-800 dark:text-white line-clamp-3">
                                                                                    {story.summary}
                                                                                </p>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="mt-6 text-sm font-medium">
                                                            <Link href="/search" passHref>
                                                                <a className="text-rose-700 hover:text-rose-500 dark:text-rose-500">
                                                                    {' '}
                                                                    View all posts{' '}
                                                                    <span aria-hidden="true">
                                                                        &rarr;
                                                                    </span>
                                                                </a>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Popover.Panel>
                                        </Transition>
                                    </>
                                )}
                            </Popover>
                        </Popover.Group>
                        <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                            {IS_SEARCH_ENABLED && (
                                <Button.Link
                                    href="/search"
                                    localeCode={getLinkLocaleSlug()}
                                    variation="navigation"
                                    className={classNames(styles.searchToggle, 'dark:text-white', {
                                        [styles.hidden]: isMenuOpen,
                                        [styles.close]: isSearchWidgetShown,
                                    })}
                                    icon={isSearchWidgetShown && isMobile ? IconClose : IconSearch}
                                    onClick={toggleSearchWidget}
                                    aria-expanded={isSearchWidgetShown}
                                    aria-controls="search-widget"
                                    title={formatMessage(translations.search.title)}
                                    aria-label={formatMessage(translations.search.title)}
                                />
                            )}
                            <ThemeSelector />
                        </div>
                    </div>
                </div>
            </div>

            <Transition
                as={Fragment}
                enter="duration-200 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Popover.Panel
                    focus
                    className="absolute z-30 top-0 inset-x-0 transition transform origin-top-right md:hidden"
                >
                    <div className="ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                        <div className="pt-5 pb-6 px-5 sm:pb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    {square_logo ? (
                                        <Image
                                            layout="fill"
                                            objectFit="contain"
                                            imageDetails={square_logo}
                                            alt={newsroomName}
                                            className="h-8 w-auto"
                                        />
                                    ) : (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            className="h-8 w-auto"
                                            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                            alt="Workflow"
                                        />
                                    )}
                                </div>
                                <div className="-mr-2">
                                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                        <span className="sr-only">Close menu</span>
                                        <XIcon className="h-6 w-6" aria-hidden="true" />
                                    </Popover.Button>
                                </div>
                            </div>
                            <div className="mt-6 sm:mt-8">
                                <nav>
                                    <div className="grid gap-7 sm:grid-cols-2 sm:gap-y-8 sm:gap-x-4">
                                        {categories.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className="-m-3 flex items-center p-3 rounded-lg hover:bg-gray-50"
                                            >
                                                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-rose-500 text-white sm:h-12 sm:w-12">
                                                    <item.icon
                                                        className="h-6 w-6"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <div className="ml-4 text-base font-medium text-gray-900">
                                                    {item.name}
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    <div className="mt-8 text-base">
                                        <a
                                            href="/search"
                                            className="font-medium text-rose-700 hover:text-rose-500"
                                        >
                                            {' '}
                                            Read all posts <span aria-hidden="true">&rarr;</span>
                                        </a>
                                    </div>
                                </nav>
                            </div>
                        </div>
                        <div className="py-6 px-5">
                            <div className="grid grid-cols-2 gap-4">
                                {resources.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="rounded-md text-base font-medium text-gray-900 hover:text-rose-700"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>

            {IS_SEARCH_ENABLED && (
                <SearchWidget
                    dialogClassName={styles.mobileSearchWrapper}
                    isOpen={isSearchWidgetShown}
                    onClose={closeSearchWidget}
                />
            )}
        </Popover>
    );
}
