import type { Category as CategoryType } from '@prezly/sdk';
import type { PaginationProps } from '@prezly/theme-kit-nextjs';
import Link from 'next/link';

import { Container } from '@/components/TailwindSpotlight/Container';
import type { StoryWithImage } from 'types';

import InfiniteStories from '../InfiniteStories';
import Layout from '../Layout';

import CategoryHeader from './CategoryHeader';

interface Props {
    category: CategoryType;
    pagination: PaginationProps;
    stories: StoryWithImage[];
}

function Category({ category, pagination, stories }: Props) {
    return (
        <Layout
            title={category.display_name}
            description={category.display_description || undefined}
        >
            <Container className="mt-8 sm:px-8 mt-16 sm:mt-32">
                <div className="sm:mt-4 lg:grid lg:grid-cols-3 lg:items-center lg:gap-2 content-start">
                    <CategoryHeader category={category} className="col-span-2" />

                    <div className="flex flex-col items-start sm:flex-row lg:mt-0 lg:justify-end">
                        <Link
                            target={'_blank'}
                            href={`/category/${
                                'i18n' in category ? category.i18n.en.slug : ''
                            }/feed`}
                            className="items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none flex-none bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70"
                        >
                            RSS Feed
                        </Link>
                    </div>
                </div>
                <InfiniteStories
                    initialStories={stories}
                    pagination={pagination}
                    category={category}
                />
            </Container>
        </Layout>
    );
}

export default Category;
