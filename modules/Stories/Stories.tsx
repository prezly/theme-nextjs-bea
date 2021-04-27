import type { FunctionComponent } from 'react';
import Link from 'next/link';
import type { Story } from '@prezly/sdk';
import { PaginationProps } from 'types';
import Pagination from './Pagination';

type Props = {
    stories: Story[];
    pagination: PaginationProps;
};

const Stories: FunctionComponent<Props> = ({ stories, pagination }) => (
    <div>
        {stories.map((story) => (
            <Link key={story.id} href={`/${story.slug}`} passHref>
                <a style={{ display: 'block', marginBottom: 20 }}>
                    <img src={story.thumbnail_url} alt="" />
                    <span>{story.title}</span>
                </a>
            </Link>
        ))}

        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Pagination {...pagination} />
    </div>
);

export default Stories;
