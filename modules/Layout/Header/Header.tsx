import { Popover, Transition } from '@headlessui/react';
import classNames from 'clsx';
import Image from 'next/future/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { CSSProperties, PropsWithChildren, ReactNode } from 'react';
import { Fragment, useEffect, useRef } from 'react';

import { Container } from '@/components/TailwindSpotlight/Container';

import avatarImage from '@/public/images/avatar.jpeg';

interface ClassNameProps {
    className?: string;
}

interface AvatarContainerProps {
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

interface AvatarProps {
    className?: string;
    large?: boolean;
    style?: CSSProperties;
}

interface HrefProps {
    href: string;
}

function CloseIcon(props: ClassNameProps) {
    const { className } = props;
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
            <path
                d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ChevronDownIcon(props: ClassNameProps) {
    const { className } = props;
    return (
        <svg viewBox="0 0 8 6" aria-hidden="true" className={className}>
            <path
                d="M1.75 1.75 4 4.25l2.25-2.5"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function SunIcon(props: ClassNameProps) {
    const { className } = props;
    return (
        <svg
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={className}
        >
            <path d="M8 12.25A4.25 4.25 0 0 1 12.25 8v0a4.25 4.25 0 0 1 4.25 4.25v0a4.25 4.25 0 0 1-4.25 4.25v0A4.25 4.25 0 0 1 8 12.25v0Z" />
            <path
                d="M12.25 3v1.5M21.5 12.25H20M18.791 18.791l-1.06-1.06M18.791 5.709l-1.06 1.06M12.25 20v1.5M4.5 12.25H3M6.77 6.77 5.709 5.709M6.77 17.73l-1.061 1.061"
                fill="none"
            />
        </svg>
    );
}

function MoonIcon(props: ClassNameProps) {
    const { className } = props;
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
            <path
                d="M17.25 16.22a6.937 6.937 0 0 1-9.47-9.47 7.451 7.451 0 1 0 9.47 9.47ZM12.75 7C17 7 17 2.75 17 2.75S17 7 21.25 7C17 7 17 11.25 17 11.25S17 7 12.75 7Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function MobileNavItem(props: PropsWithChildren<HrefProps>) {
    const { href, children } = props;
    return (
        <li>
            <Popover.Button as={Link} href={href} className="block py-2">
                {children}
            </Popover.Button>
        </li>
    );
}

function MobileNavigation(props: ClassNameProps) {
    const { className } = props;
    return (
        <Popover className={className}>
            <Popover.Button className="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20">
                Menu
                <ChevronDownIcon className="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
            </Popover.Button>
            <Transition.Root>
                <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm dark:bg-black/80" />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Popover.Panel
                        focus
                        className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800"
                    >
                        <div className="flex flex-row-reverse items-center justify-between">
                            <Popover.Button aria-label="Close menu" className="-m-1 p-1">
                                <CloseIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                            </Popover.Button>
                            <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                Navigation
                            </h2>
                        </div>
                        <nav className="mt-6">
                            <ul className="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                                <MobileNavItem href="/about">About</MobileNavItem>
                                <MobileNavItem href="/articles">Articles</MobileNavItem>
                                <MobileNavItem href="/speaking">
                                    How I built this blog
                                </MobileNavItem>
                                <MobileNavItem href="/uses">Uses</MobileNavItem>
                            </ul>
                        </nav>
                    </Popover.Panel>
                </Transition.Child>
            </Transition.Root>
        </Popover>
    );
}

function NavItem(props: PropsWithChildren<HrefProps>) {
    const { href, children } = props;
    const isActive = useRouter().pathname === href;

    return (
        <li>
            <Link
                href={href}
                className={classNames(
                    'relative block px-3 py-2 transition',
                    isActive
                        ? 'text-rose-500 dark:text-rose-400'
                        : 'hover:text-rose-500 dark:hover:text-rose-400',
                )}
            >
                {children}
                {isActive && (
                    <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-rose-500/0 via-rose-500/40 to-rose-500/0 dark:from-rose-400/0 dark:via-rose-400/40 dark:to-rose-400/0" />
                )}
            </Link>
        </li>
    );
}

function DesktopNavigation(props: ClassNameProps) {
    const { className } = props;
    return (
        <nav className={className}>
            <ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                <NavItem href="/about">About</NavItem>
                <NavItem href="/articles">Articles</NavItem>
                <NavItem href="/uses">Uses</NavItem>
                <NavItem href="/speaking">Contact</NavItem>
            </ul>
        </nav>
    );
}

function ModeToggle() {
    function disableTransitionsTemporarily() {
        document.documentElement.classList.add('[&_*]:!transition-none');
        window.setTimeout(() => {
            document.documentElement.classList.remove('[&_*]:!transition-none');
        }, 0);
    }

    function toggleMode() {
        disableTransitionsTemporarily();

        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const isSystemDarkMode = darkModeMediaQuery.matches;
        const isDarkMode = document.documentElement.classList.toggle('dark');

        if (isDarkMode === isSystemDarkMode) {
            delete window.localStorage.isDarkMode;
        } else {
            window.localStorage.isDarkMode = isDarkMode;
        }
    }

    return (
        <button
            type="button"
            aria-label="Toggle dark mode"
            className="group rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
            onClick={toggleMode}
        >
            <SunIcon className="h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-rose-50 [@media(prefers-color-scheme:dark)]:stroke-rose-500 [@media(prefers-color-scheme:dark)]:group-hover:fill-rose-50 [@media(prefers-color-scheme:dark)]:group-hover:stroke-rose-600" />
            <MoonIcon className="hidden h-6 w-6 fill-zinc-700 stroke-zinc-500 transition dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400 [@media_not_(prefers-color-scheme:dark)]:fill-rose-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-rose-500" />
        </button>
    );
}

function clamp(number: number, a: number, b: number) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return Math.min(Math.max(number, min), max);
}

function AvatarContainer(props: AvatarContainerProps) {
    const { className, style, children } = props;
    return (
        <div
            className={classNames(
                className,
                'h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10',
            )}
            style={style}
        >
            {children}
        </div>
    );
}

function Avatar(props: AvatarProps) {
    const { large = false, className, style } = props;
    return (
        <Link
            href="/"
            aria-label="Home"
            className={classNames(className, 'pointer-events-auto')}
            style={style}
        >
            <Image
                src={avatarImage}
                alt=""
                className={classNames(
                    'rounded-full bg-zinc-100 dark:bg-zinc-800',
                    large ? 'h-16 w-16' : 'h-9 w-9',
                )}
                priority
            />
        </Link>
    );
}

export function Header() {
    const isHomePage = useRouter().pathname === '/';

    const headerRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const isInitial = useRef(true);

    useEffect(() => {
        // @ts-ignore
        const downDelay = avatarRef.current?.offsetTop ?? 0;
        const upDelay = 64;

        function setProperty(property: string, value: string) {
            document.documentElement.style.setProperty(property, value);
        }

        function updateHeaderStyles() {
            // @ts-ignore
            const { top, height } = headerRef.current.getBoundingClientRect();
            const scrollY = clamp(
                window.scrollY,
                0,
                document.body.scrollHeight - window.innerHeight,
            );

            if (isInitial.current) {
                setProperty('--header-position', 'sticky');
            }

            setProperty('--content-offset', `${downDelay}px`);

            if (isInitial.current || scrollY < downDelay) {
                setProperty('--header-height', `${downDelay + height}px`);
                setProperty('--header-mb', `${-downDelay}px`);
            } else if (top + height < -upDelay) {
                const offset = Math.max(height, scrollY - upDelay);
                setProperty('--header-height', `${offset}px`);
                setProperty('--header-mb', `${height - offset}px`);
            } else if (top === 0) {
                setProperty('--header-height', `${scrollY + height}px`);
                setProperty('--header-mb', `${-scrollY}px`);
            }
        }

        function updateAvatarStyles() {
            if (!isHomePage) {
                return;
            }

            const fromScale = 1;
            const toScale = 36 / 64;
            const fromX = 0;
            const toX = 2 / 16;

            const scrollY = downDelay - window.scrollY;

            let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale;
            scale = clamp(scale, fromScale, toScale);

            let x = (scrollY * (fromX - toX)) / downDelay + toX;
            x = clamp(x, fromX, toX);

            setProperty('--avatar-image-transform', `translate3d(${x}rem, 0, 0) scale(${scale})`);

            const borderScale = 1 / (toScale / scale);
            const borderX = (-toX + x) * borderScale;
            const borderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`;

            setProperty('--avatar-border-transform', borderTransform);
            // @ts-ignore
            setProperty('--avatar-border-opacity', scale === toScale ? 1 : 0);
        }

        function updateStyles() {
            updateHeaderStyles();
            updateAvatarStyles();
            isInitial.current = false;
        }

        updateStyles();
        window.addEventListener('scroll', updateStyles, { passive: true });
        window.addEventListener('resize', updateStyles);

        return () => {
            // @ts-ignore
            window.removeEventListener('scroll', updateStyles, { passive: true });
            window.removeEventListener('resize', updateStyles);
        };
    }, [isHomePage]);

    return (
        <>
            <header
                className="flex flex-col"
                style={{
                    height: 'var(--header-height)',
                    marginBottom: 'var(--header-mb)',
                }}
            >
                {isHomePage && (
                    <>
                        <div
                            ref={avatarRef}
                            className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
                        />
                        <Container
                            className="pointer-events-none top-0 z-50 order-last -mb-3 pt-3"
                            // @ts-expect-error
                            style={{ position: 'var(--header-position)' }}
                        >
                            <div className="relative">
                                <AvatarContainer
                                    className="absolute left-0 top-3 origin-left transition-opacity"
                                    style={{
                                        opacity: 'var(--avatar-border-opacity, 0)',
                                        transform: 'var(--avatar-border-transform)',
                                    }}
                                />
                                <Avatar
                                    large
                                    className="block h-16 w-16 origin-left"
                                    style={{ transform: 'var(--avatar-image-transform)' }}
                                />
                            </div>
                        </Container>
                    </>
                )}
                <div
                    ref={headerRef}
                    className="pointer-events-none top-0 z-50 pt-6"
                    // @ts-expect-error
                    style={{ position: 'var(--header-position)' }}
                >
                    <Container>
                        <div className="relative flex gap-4">
                            <div className="flex flex-1">
                                {!isHomePage && (
                                    <AvatarContainer>
                                        <Avatar />
                                    </AvatarContainer>
                                )}
                            </div>
                            <div className="flex flex-1 justify-end md:justify-center">
                                <MobileNavigation className="pointer-events-auto md:hidden" />
                                <DesktopNavigation className="pointer-events-auto hidden md:block" />
                            </div>
                            <div className="flex justify-end md:flex-1">
                                <div className="pointer-events-auto">
                                    <ModeToggle />
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </header>
            {isHomePage && <div style={{ height: 'var(--content-offset)' }} />}
        </>
    );
}
