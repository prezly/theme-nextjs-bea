import { IconTwitter } from '@prezly/icons';
import { Button } from '@prezly/themes-ui-components';
import Image from 'next/image';

export default function Hero() {
    return (
        <section className="py-4 md:grid md:grid-cols-2 md:gap-10 md:items-center">
            <div className="relative aspect-square">
                <Image
                    layout="fill"
                    objectFit="cover"
                    src="https://ucarecdn.com/de234bd9-ccb9-46a6-8af2-67a30d4a3f92/-/scale_crop/560x560/center/-/quality/best/-/format/auto/_DSC0320Edit.jpg"
                    alt="Picture of me in Portugal, 2018"
                    className="rounded"
                />
            </div>
            <div className="py-10 text-center md:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl xl:text-6xl">
                    Hello! I&apos;m Gijs
                </h1>
                <p className="mt-6 mx-auto text-lg text-gray-500 lg:text-xl md:mt-5">
                    On this page I write about running a company and other things related to the
                    web. I love to build stuff like this blog, JS/TS glue code and stuff in the real
                    world.
                </p>
                <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <Button.Link
                        href="https://www.twitter.com/digitalbase"
                        variation="primary"
                        icon={IconTwitter}
                        className="flex"
                    >
                        Contact
                    </Button.Link>
                    <Button.Link
                        href="/about"
                        variation="secondary"
                        className="flex dark:text-white"
                    >
                        About me
                    </Button.Link>
                </div>
                <p className="mt-6 mx-auto text-sm text-gray-500 lg:text-base">
                    This page was built using{' '}
                    <a href="https://nextjs.org/" className="underline hover:text-primary">
                        Next.js
                    </a>
                    ,{' '}
                    <a href="https://tailwindcss.com/" className="underline hover:text-primary">
                        Tailwind
                    </a>{' '}
                    and{' '}
                    <a
                        href="https://www.prezly.com/developers"
                        className="underline hover:text-primary"
                    >
                        Prezly SDK
                    </a>
                    .{' '}
                    <a
                        href="https://github.com/digitalbase/lifelog-nextjs"
                        className="underline hover:text-primary"
                    >
                        See the code
                    </a>
                </p>
            </div>
        </section>
    );
}
